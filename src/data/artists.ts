/**
 * @fileOverview Data processing layer for artist and track information.
 * This file imports raw data from various datasets, parses them into a
 * unified format, and exports a final list of artists for the application.
 * It's designed to be extensible for new datasets.
 */
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// To add a new dataset, import it here.
// import { myDatasetTracklist } from './datasets/my-dataset';

// Interfaces for unified data structure
export interface Track {
  title: string;
  dataset: string;
  bandcampUrl?: string;
  spotifyUrl?: string;
}

export interface Artist {
  artistName: string;
  genre: string;
  tracks: Track[];
  bandcampUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  otherLinks?: string[];
}

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
      links: {
        bandcampUrl: row.bandcamp_url || undefined,
        spotifyUrl: row.spotify_url || undefined,
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
      skipEmptyLines: true,
    });

    for (const rawTrack of parsedCsv.data as any[]) {
      const { title, artistName, genre, links } = dataset.parser(rawTrack);

      if (!artistName) continue;

      if (!artistsMap.has(artistName)) {
        artistsMap.set(artistName, {
          artistName,
          genre,
          tracks: [],
          // In a real scenario, social links could come from the dataset
          // or a separate mapping file. They are omitted here to allow AI to find them.
        });
      }

      const artist = artistsMap.get(artistName)!;
      // Ensure the same track from a different dataset isn't added twice.
      if (!artist.tracks.some((t) => t.title === title)) {
        artist.tracks.push({
          title,
          dataset: dataset.name,
          bandcampUrl: links?.bandcampUrl,
          spotifyUrl: links?.spotifyUrl,
        });
      }
    }
  }

  return Array.from(artistsMap.values());
}

// --- Main Export ---
// Process all registered datasets and export the final artist list.
export const artists: Artist[] = parseAndMergeArtists(datasetsToParse);
