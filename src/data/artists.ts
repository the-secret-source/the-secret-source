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
    console.log(`[artists.ts] Processing dataset: ${dataset.name}`);
    try {
      const absolutePath = path.join(process.cwd(), 'src/data', dataset.filePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');
      
      const parsedCsv = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: 'greedy',
        trimHeaders: true, // Robustness against whitespace in headers
      });
      console.log(`[artists.ts] Parsed CSV for ${dataset.name}. Found ${parsedCsv.data.length} rows.`);


      for (const rawTrack of parsedCsv.data as any[]) {
        console.log('\n[artists.ts] ----- Processing New Row -----');
        if (!rawTrack || !rawTrack.artist_name || !rawTrack.track_title) {
            console.log('[artists.ts] Skipping invalid row:', rawTrack);
            continue;
        }
        
        console.log('[artists.ts] Raw Row Data:', JSON.stringify(rawTrack));

        const { title, artistName, source, links } = dataset.parser(rawTrack);
        
        console.log(`[artists.ts] Parsed artist: "${artistName}", title: "${title}"`);
        console.log('[artists.ts] Parsed Links Object:', JSON.stringify(links));


        if (!artistsMap.has(artistName)) {
            console.log(`[artists.ts] New artist found: ${artistName}. Creating new entry.`);
            artistsMap.set(artistName, {
                artistName,
                tracks: [],
            });
        }

        const artist = artistsMap.get(artistName)!;

        // Create the new track object with all of its links from the CSV data.
        const newTrack: Track = {
          title,
          dataset: dataset.name,
          source: source,
          ...links,
        };
        
        console.log('[artists.ts] Created new track object:', JSON.stringify(newTrack));
        
        // Add the fully-formed track to the artist's track list.
        artist.tracks.push(newTrack);
        
        console.log(`[artists.ts] Pushed track to artist. Total tracks for ${artistName}: ${artist.tracks.length}`);
        
        // NOTE: We are no longer copying links from the track to the artist object
        // to ensure track-level links are always preserved and displayed.
        // Artist-level links would need to be provided separately in the data source.
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
    console.log('[artists.ts] getArtists() called with filters:', filters);

    if (!cachedArtists || cachedArtists.length === 0) {
        console.log('[artists.ts] No cached artists found or cache is empty. Loading from source.');
        cachedArtists = loadAndParseArtists();
        console.log(`[artists.ts] Caching new artists. Count: ${cachedArtists.length}`);
    } else {
      console.log(`[artists.ts] Using cached artists. Count: ${cachedArtists.length}`);
    }

    let artistsToFilter = cachedArtists;

    // Filter by link types if provided
    if (filters?.linkTypes) {
      if (filters.linkTypes.length === 0) {
        return []; // Return empty if no link types are selected
      }
      console.log('[artists.ts] Filtering for artists by link types:', filters.linkTypes);
      artistsToFilter = artistsToFilter.filter(artist => {
        // Check if the artist or any of their tracks has at least one of the selected link types
        const hasRequiredLink = (obj: any): boolean => {
          return filters!.linkTypes!.some(linkType => {
            if (linkType === 'otherLinks') {
              return Array.isArray(obj[linkType]) && obj[linkType].length > 0;
            }
            return !!obj[linkType];
          });
        };
        
        return hasRequiredLink(artist) || artist.tracks.some(hasRequiredLink);
      });
      console.log(`[artists.ts] After link type filtering: ${artistsToFilter.length} artists remain.`);
    }

    // Filter by dataset if provided
    if (filters?.datasets && filters.datasets.length > 0 && filters.datasets.length < getDatasetNames().length) {
      console.log(`[artists.ts] Filtering artists by datasets: ${filters.datasets.join(', ')}`);

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
      console.log(`[artists.ts] After dataset filtering: ${artistsToFilter.length} artists remain.`);
    }
    
    console.log(`[artists.ts] Returning ${artistsToFilter.length} artists.`);
    return artistsToFilter;
}
