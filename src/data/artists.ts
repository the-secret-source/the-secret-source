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
      console.log(`[artists.ts] Reading file from absolute path: ${absolutePath}`);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');
      console.log(`[artists.ts] Successfully read file. Content length: ${fileContent.length}`);
      
      const parsedCsv = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: 'greedy',
      });
      console.log(`[artists.ts] Parsed CSV data. Found ${parsedCsv.data.length} rows.`);


      for (const rawTrack of parsedCsv.data as any[]) {
        console.log('[artists.ts] Processing raw row:', rawTrack);
        if (!rawTrack || !rawTrack.artist_name || !rawTrack.track_title) {
          console.log('[artists.ts] Skipping invalid row:', rawTrack);
          continue;
        }
        
        const { title, artistName, source, links } = dataset.parser(rawTrack);
        console.log(`[artists.ts] Parsed track data for artist: ${artistName}, title: ${title}`);

        if (!artistsMap.has(artistName)) {
          console.log(`[artists.ts] New artist found: ${artistName}. Creating new entry.`);
          artistsMap.set(artistName, {
            artistName,
            tracks: [],
          });
        }

        const artist = artistsMap.get(artistName)!;

        const newTrack: Track = {
          title,
          dataset: dataset.name,
          source: source,
          ...links,
        };
        
        console.log(`[artists.ts] Adding track "${title}" to artist "${artistName}".`);
        artist.tracks.push(newTrack);

        for (const urlKey in links) {
          if (!artist[urlKey]) {
            const trackUrl = links[urlKey];
            console.log(`[artists.ts] Checking to see if artist link should be inferred for key: ${urlKey}`);
            if (urlKey === 'bandcampUrl' && trackUrl) {
              try {
                const url = new URL(trackUrl);
                if (url.hostname.endsWith('bandcamp.com')) {
                  const inferredUrl = `${url.protocol}//${url.hostname}`;
                  artist.bandcampUrl = inferredUrl;
                  console.log(`[artists.ts] Inferred and set Bandcamp URL for ${artistName}: ${inferredUrl}`);
                }
              } catch (e) {
                console.error(`[artists.ts] Could not parse URL for inference: ${trackUrl}`, e);
              }
            } else if (trackUrl) {
              artist[urlKey] = trackUrl;
              console.log(`[artists.ts] Set ${urlKey} for ${artistName}: ${trackUrl}`);
            }
          }
        }
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
 * Optionally filters artists by dataset.
 * @param filters - Optional filters to apply.
 * @returns An array of artists.
 */
export function getArtists(filters?: { datasets?: string[]; linkTypes?: string[] }): Artist[] {
    console.log('[artists.ts] getArtists() called with filters:', filters);

    const getArtistCategory = (artist: Artist): 'direct' | 'streaming' | 'other' | 'none' => {
      const directSupportKeys = ['bandcampUrl', 'discogsUrl'];
      const streamingKeys = ['spotifyUrl', 'appleMusicUrl'];
      const otherLinkKeys = ['youtubeUrl', 'otherLinks', 'soundcloudUrl', 'weathervaneUrl', 'mixRescueUrl'];

      const hasLink = (obj: any, keys: string[]) => {
        if (!obj) return false;
        return keys.some(key => {
          if (key === 'otherLinks') {
            return Array.isArray(obj[key]) && obj[key].length > 0;
          }
          return !!obj[key];
        });
      }
      
      const hasArtistDirectLink = hasLink(artist, directSupportKeys);
      const hasTrackDirectLink = artist.tracks.some(track => hasLink(track, directSupportKeys));
      if (hasArtistDirectLink || hasTrackDirectLink) return 'direct';

      const hasArtistStreamingLink = hasLink(artist, streamingKeys);
      const hasTrackStreamingLink = artist.tracks.some(track => hasLink(track, streamingKeys));
      if (hasArtistStreamingLink || hasTrackStreamingLink) return 'streaming';

      const hasArtistOtherLink = hasLink(artist, otherLinkKeys);
      const hasTrackOtherLink = artist.tracks.some(track => hasLink(track, otherLinkKeys));
      if (hasArtistOtherLink || hasTrackOtherLink) return 'other';

      return 'none';
    };
    
    if (!cachedArtists || cachedArtists.length === 0) {
        console.log('[artists.ts] No cached artists found or cache is empty. Loading from source.');
        cachedArtists = loadAndParseArtists();
        console.log(`[artists.ts] Caching new artists. Count: ${cachedArtists.length}`);
    } else {
      console.log(`[artists.ts] Using cached artists. Count: ${cachedArtists.length}`);
    }

    let artistsToFilter = cachedArtists;

    if (filters?.linkTypes) {
      if (filters.linkTypes.length === 0) {
        return []; // Return empty if no link types are selected
      }
      console.log('[artists.ts] Filtering for artists by link types:', filters.linkTypes);
      artistsToFilter = artistsToFilter.filter(artist => {
          const category = getArtistCategory(artist);
          return filters.linkTypes!.includes(category);
      });
      console.log(`[artists.ts] After link type filtering: ${artistsToFilter.length} artists remain.`);
    }

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
