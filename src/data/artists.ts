/**
 * @fileOverview Data processing layer for artist and track information.
 * This file imports raw data from various datasets, parses them into a
 * unified format, and exports a final list of artists for the application.
 * It's designed to be extensible for new datasets.
 */
import { musdb18Tracklist } from './datasets/musdb-18';

// Interfaces for unified data structure
export interface Track {
  title: string;
  dataset: string;
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

/**
 * Parses the raw MUSDB-18 tracklist into the unified Artist format.
 * This function groups tracks by artist.
 * @param tracklist The raw tracklist from MUSDB-18, expected as [title, artist, genre][].
 * @returns An array of artists, conforming to the Artist interface.
 */
function parseMusdb18Data(tracklist: [string, string, string][]): Artist[] {
  const artistsMap = new Map<string, Artist>();

  for (const [title, artistName, genre] of tracklist) {
    if (!artistsMap.has(artistName)) {
      artistsMap.set(artistName, {
        artistName,
        genre,
        tracks: [],
        // In a real scenario, social links would come from the dataset
        // or a separate mapping file. For this demo, they are omitted.
      });
    }

    const artist = artistsMap.get(artistName)!;
    artist.tracks.push({
      title,
      dataset: 'MUSDB-18',
    });
  }

  return Array.from(artistsMap.values());
}


// --- Dataset Registration ---
// To add a new dataset:
// 1. Create a new data file in `src/data/datasets/`.
// 2. Import the raw data here.
// 3. Create a parser function for it (like parseMusdb18Data).
// 4. Call the parser and add its output to the `artists` array below.

const musdb18Artists = parseMusdb18Data(musdb18Tracklist);

// Combine artists from all registered datasets.
export const artists: Artist[] = [
  ...musdb18Artists,
  // ...add artists from other datasets here.
];
