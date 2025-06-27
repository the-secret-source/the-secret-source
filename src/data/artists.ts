/**
 * @fileOverview Data processing layer for artist and track information.
 * This file imports raw data from various datasets, parses them into a
 * unified format, and exports a final list of artists for the application.
 * It's designed to be extensible for new datasets.
 */
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import type { Artist, Track } from '@/lib/types';

// --- Dataset Definitions ---
// Register all datasets here. Each object needs a name and the tracklist data.
const datasetsToParse = [
  {
    name: 'MUSDB-18',
    filePath: 'datasets/musdb-18.csv',
    // The parser function dynamically handles any column ending in `_url`.
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
  // Example for adding another dataset:
  // {
  //   name: 'My-Dataset',
  //   filePath: 'datasets/my-dataset.csv',
  //   parser: (row: any) => { /* ... */ }
  // }
];

/**
 * Parses and merges tracklists from multiple datasets into a unified,
 * de-duplicated list of artists.
 * @param datasets An array of dataset objects to process.
 * @returns An array of artists, conforming to the Artist interface.
 */
function parseAndMergeArtists(datasets: typeof datasetsToParse): Artist[] {
  const artistsMap = new Map<string, Artist>();

  for (const dataset of datasets) {
    try {
      const absolutePath = path.join(process.cwd(), 'src/data', dataset.filePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');
      
      const parsedCsv = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: 'greedy',
      });

      for (const rawTrack of parsedCsv.data as any[]) {
        // A more robust check to ensure that we only process valid track data.
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
          ...links, // Spread all dynamic URLs onto the track object
        };

        artist.tracks.push(newTrack);

        // Infer artist-level URLs from track URLs.
        for (const urlKey in links) {
          // If the artist doesn't have this URL yet, try to infer it.
          if (!artist[urlKey]) {
            const trackUrl = links[urlKey];
            // Special logic for Bandcamp to get the root artist page
            if (urlKey === 'bandcampUrl' && trackUrl) {
              try {
                const url = new URL(trackUrl);
                if (url.hostname.endsWith('bandcamp.com')) {
                  artist.bandcampUrl = `${url.protocol}//${url.hostname}`;
                }
              } catch (e) {
                console.error(`Could not parse bandcamp URL for track: ${trackUrl}`);
              }
            } else if (trackUrl) {
              // For all other URLs (spotify, discogs, etc.), we'll just copy the first one we find.
              artist[urlKey] = trackUrl;
            }
          }
        }
      }
    } catch(e) {
      console.error(`Failed to read or process dataset: ${dataset.name}`, e);
    }
  }

  return Array.from(artistsMap.values());
}

// --- Main Export ---
// Process all registered datasets and export the final artist list.
export const artists: Artist[] = parseAndMergeArtists(datasetsToParse);
