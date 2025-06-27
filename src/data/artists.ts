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

// --- Dataset Definitions ---
const datasetsToParse = [
  {
    name: 'MUSDB-18',
    filePath: 'datasets/musdb-18.csv',
    parser: (row: any) => {
      const parsed: { [key: string]: any } = {
        title: row.track_title,
        artistName: row.artist_name,
        genre: row.genre,
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
    },
  },
];

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
        
        const { title, artistName, genre, source, links } = dataset.parser(rawTrack);
        console.log(`[artists.ts] Parsed track data for artist: ${artistName}, title: ${title}`);

        if (!artistsMap.has(artistName)) {
          console.log(`[artists.ts] New artist found: ${artistName}. Creating new entry.`);
          artistsMap.set(artistName, {
            artistName,
            genre,
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
      console.error(`[artists.ts] Failed to read or process dataset: ${dataset.name}`, e);
    }
  }

  const finalArtists = Array.from(artistsMap.values());
  console.log(`[artists.ts] Finished parsing. Total unique artists found: ${finalArtists.length}`);
  return finalArtists;
}


/**
 * Retrieves the list of all artists, loading and caching them if necessary.
 * @returns An array of artists.
 */
export function getArtists(): Artist[] {
    console.log('[artists.ts] getArtists() called.');
    if (cachedArtists && cachedArtists.length > 0) {
        console.log(`[artists.ts] Returning cached artists. Count: ${cachedArtists.length}`);
        return cachedArtists;
    }
    console.log('[artists.ts] No cached artists found or cache is empty. Loading from source.');
    cachedArtists = loadAndParseArtists();
    console.log(`[artists.ts] Caching and returning new artists. Count: ${cachedArtists.length}`);
    return cachedArtists;
}
