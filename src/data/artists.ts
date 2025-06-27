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
  const artistsMap = new Map<string, Artist>();

  for (const dataset of datasetsToParse) {
    try {
      const absolutePath = path.join(process.cwd(), 'src/data', dataset.filePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');
      
      const parsedCsv = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: 'greedy',
      });

      for (const rawTrack of parsedCsv.data as any[]) {
        if (!rawTrack || !rawTrack.artist_name || !rawTrack.track_title) {
          continue;
        }
        
        const { title, artistName, genre, source, links } = dataset.parser(rawTrack);

        if (!artistsMap.has(artistName)) {
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

        artist.tracks.push(newTrack);

        for (const urlKey in links) {
          if (!artist[urlKey]) {
            const trackUrl = links[urlKey];
            if (urlKey === 'bandcampUrl' && trackUrl) {
              try {
                const url = new URL(trackUrl);
                if (url.hostname.endsWith('bandcamp.com')) {
                  artist.bandcampUrl = `${url.protocol}//${url.hostname}`;
                }
              } catch (e) {
                // Ignore invalid URLs
              }
            } else if (trackUrl) {
              artist[urlKey] = trackUrl;
            }
          }
        }
      }
    } catch(e) {
      console.error(`Failed to read or process dataset: ${dataset.name}`, e);
      // If a file fails to parse, we'll continue with what we have, but the error will be logged.
    }
  }

  return Array.from(artistsMap.values());
}


/**
 * Retrieves the list of all artists, loading and caching them if necessary.
 * @returns An array of artists.
 */
export function getArtists(): Artist[] {
    if (cachedArtists) {
        return cachedArtists;
    }
    cachedArtists = loadAndParseArtists();
    return cachedArtists;
}
