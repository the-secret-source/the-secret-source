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

// To add a new dataset, import it here.
// import { myDatasetTracklist } from './datasets/my-dataset';

// --- Dataset Definitions ---
// Register all datasets here. Each object needs a name and the tracklist data.
const datasetsToParse = [
  {
    name: 'MUSDB-18',
    filePath: 'datasets/musdb-18.csv',
    // The parser function can be customized per-dataset if the format differs.
    parser: (row: any) => ({
      title: row.track_title,
      artistName: row.artist_name,
      genre: row.genre,
      source: row.source,
      links: {
        bandcampUrl: row.bandcamp_url || undefined,
      },
    }),
  },
  // Example for adding another dataset:
  // {
  //   name: 'My-Dataset',
  //   filePath: 'datasets/my-dataset.csv',
  //   parser: (row: any) => ({
  //     title: row.track_title,
  //     artistName: row.artist_name,
  //     genre: row.genre,
  //     source: row.source,
  //     links: {
  //       bandcampUrl: row.bandcamp_url || undefined,
  //       spotifyUrl: row.spotify_url || undefined
  //     },
  //   }),
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
    const absolutePath = path.join(process.cwd(), 'src/data', dataset.filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const parsedCsv = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: 'greedy', // More robustly skips empty lines
    });

    for (const rawTrack of parsedCsv.data as any[]) {
      // Skip any row that doesn't have the essential data.
      if (!rawTrack.artist_name || !rawTrack.track_title) {
        continue;
      }
      
      const { title, artistName, genre, source, links } = dataset.parser(rawTrack);

      if (!artistsMap.has(artistName)) {
        artistsMap.set(artistName, {
          artistName,
          genre,
          tracks: [],
          // Social links are found by the AI, not from the initial dataset.
        });
      }

      const artist = artistsMap.get(artistName)!;

      const newTrack: Track = {
        title,
        dataset: dataset.name,
        source: source,
        bandcampUrl: links.bandcampUrl,
      };

      artist.tracks.push(newTrack);

      // Infer artist bandcampUrl from the first available track bandcampUrl
      if (!artist.bandcampUrl && newTrack.bandcampUrl) {
        try {
          const url = new URL(newTrack.bandcampUrl);
          if (url.hostname.endsWith('bandcamp.com')) {
             // From: https://artist.bandcamp.com/track/song-title
             // To:   https://artist.bandcamp.com
            artist.bandcampUrl = `${url.protocol}//${url.hostname}`;
          }
        } catch (e) {
          // Ignore invalid URLs
          console.error(`Could not parse bandcamp URL for track: ${newTrack.bandcampUrl}`);
        }
      }
    }
  }

  return Array.from(artistsMap.values());
}

// --- Main Export ---
// Process all registered datasets and export the final artist list.
export const artists: Artist[] = parseAndMergeArtists(datasetsToParse);
