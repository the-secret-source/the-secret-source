/**
 * @fileOverview Data processing layer for artist and track information.
 * This file provides a function to load, parse, and cache artist data from
 * CSV files. It's designed to be extensible for new datasets.
 */
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import type { Artist, Track } from '@/lib/types';

// --- Caching ---
let cachedArtists: Artist[] | null = null;

// --- Generic Parser ---
/**
 * A generic parser for CSV rows that conform to the expected format.
 * @param row - A row object from PapaParse.
 * @returns A structured object with title, artistName, source, and links.
 */
const genericCsvParser = (row: any) => {
  const parsed: { [key: string]: any } = {
    title: row.track_title,
    artistName: row.artist_name,
    source: row.source,
    links: {},
  };

  for (const key in row) {
    if (key.endsWith('_url') && row[key]) {
      const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      parsed.links[camelCaseKey] = row[key];
    }
  }
  return parsed;
};


// --- Dataset Definitions ---
const datasetsToParse = [
  {
    name: 'MUSDB-18',
    filePath: 'datasets/musdb-18.csv',
    parser: genericCsvParser,
  },
  {
    name: 'MedleyDB',
    filePath: 'datasets/medleydb.csv',
    parser: genericCsvParser,
  },
  {
    name: 'MagnaTagATune',
    filePath: 'datasets/mtat.csv',
    parser: genericCsvParser,
  },
  {
    name: 'MoisesDB',
    filePath: 'datasets/moisesdb.csv',
    parser: genericCsvParser,
  },
];

/**
 * Returns a list of all available dataset names.
 * @returns An array of dataset names.
 */
export function getDatasetNames(): string[] {
  return datasetsToParse.map((d) => d.name);
}


/**
 * Loads and parses artist data from the defined datasets.
 * This function is for internal use by getArtists().
 * @returns An array of artists.
 */
function loadAndParseArtists(): Artist[] {
  console.log('[artists.ts] Starting to load and parse artist data...');
  const artistsMap = new Map<string, Artist>();

  for (const dataset of datasetsToParse) {
    try {
      console.log(`[artists.ts] Parsing dataset: ${dataset.name}`);
      const absolutePath = path.join(process.cwd(), 'src/data', dataset.filePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');
      
      const parsedCsv = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: 'greedy',
        trimHeaders: true,
      });

      for (const rawTrack of parsedCsv.data as any[]) {
        if (!rawTrack || !rawTrack.artist_name || !rawTrack.track_title) {
            continue;
        }
        
        const { title, artistName, source, links } = dataset.parser(rawTrack);

        if (!artistsMap.has(artistName)) {
            artistsMap.set(artistName, {
                artistName,
                tracks: [],
            });
        }

        const artist = artistsMap.get(artistName)!;

        // Create the new track object. This object contains all its own links from the CSV.
        // It will be added to the artist's tracks array unmodified.
        const newTrack: Track = {
          title,
          dataset: dataset.name,
          source: source,
          ...links,
        };
        
        // --- Artist-level Link Inference (Without modifying the track) ---
        
        // 1. Infer artist's main Bandcamp URL from the track's URL.
        // We only do this if the artist doesn't already have a bandcampUrl.
        if (newTrack.bandcampUrl && !artist.bandcampUrl) {
          try {
            const url = new URL(newTrack.bandcampUrl);
            // This creates the base URL, e.g., https://artist.bandcamp.com
            const artistBandcampUrl = `${url.protocol}//${url.hostname}`;
            artist.bandcampUrl = artistBandcampUrl;
          } catch (e) {
            console.warn(`[artists.ts] Invalid Bandcamp URL for ${artistName}, copying as-is: ${newTrack.bandcampUrl}`);
            artist.bandcampUrl = newTrack.bandcampUrl;
          }
        }
        
        // 2. Copy other links from the track to the artist, only if not already present on the artist.
        for (const key in links) {
          if (key === 'bandcampUrl') continue;
          
          if (!artist[key]) {
            artist[key] = links[key];
          }
        }
        
        // Add the fully-formed, original track to the artist's track list.
        artist.tracks.push(newTrack);
      }
    } catch(e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn(`[artists.ts] Dataset file not found, skipping: ${dataset.name} at ${dataset.filePath}`);
      } else {
        console.error(`[artists.ts] Failed to read or process dataset: ${dataset.name}`, e);
      }
    }
  }

  const finalArtists = Array.from(artistsMap.values());
  console.log(`[artists.ts] Finished parsing. Total unique artists found: ${finalArtists.length}`);
  return finalArtists;
}

/**
 * Retrieves the list of all artists, loading and caching them if necessary.
 * Optionally filters artists by dataset and link types.
 * @param filters - Optional filters to apply.
 * @returns An array of artists.
 */
export function getArtists(filters?: { datasets?: string[]; linkTypes?: string[] }): Artist[] {
    // In development, always reload the data to see changes. In production, use cache.
    if (process.env.NODE_ENV === 'development' || !cachedArtists || cachedArtists.length === 0) {
        console.log('[artists.ts] Bypassing cache in development or cache is empty. Loading from source.');
        cachedArtists = loadAndParseArtists();
    }

    let artistsToFilter = cachedArtists;

    // Filter by link types if provided
    if (filters?.linkTypes) {
      if (filters.linkTypes.length === 0) {
        return []; // Return empty if no link types are selected
      }

      const otherKeys = ['weathervaneUrl', 'mixRescueUrl', 'otherLinks'];
      const expandedLinkTypes = filters.linkTypes.flatMap(lt => {
        if (lt === 'other') return ['otherLinks', 'weathervaneUrl', 'mixRescueUrl', 'magnatuneUrl'];
        return lt;
      });

      artistsToFilter = artistsToFilter.filter(artist => {
        // Check if the artist or any of their tracks has at least one of the selected link types
        const hasRequiredLink = (obj: any): boolean => {
          return expandedLinkTypes.some(linkType => {
            if (linkType === 'otherLinks') {
              return Array.isArray(obj[linkType]) && obj[linkType].length > 0;
            }
            return !!obj[linkType];
          });
        };
        
        return hasRequiredLink(artist) || artist.tracks.some(hasRequiredLink);
      });
    }

    // Filter by dataset if provided
    if (filters?.datasets && filters.datasets.length > 0 && filters.datasets.length < getDatasetNames().length) {
      const filteredByDataset: Artist[] = [];
      for (const artist of artistsToFilter) {
        const filteredTracks = artist.tracks.filter(track => filters.datasets!.includes(track.dataset));
        if (filteredTracks.length > 0) {
          filteredByDataset.push({
            ...artist,
            tracks: filteredTracks,
          });
        }
      }
      artistsToFilter = filteredByDataset;
    }
    
    return artistsToFilter;
}
