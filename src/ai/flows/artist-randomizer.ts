'use server';

/**
 * @fileOverview A function to select a random artist from a curated list.
 *
 * - getRandomArtist - A function that returns a random artist's information.
 */

import { artists, type Artist } from '@/data/artists';

export async function getRandomArtist(): Promise<Artist> {
  // 1. Select a random artist from the curated list.
  const randomIndex = Math.floor(Math.random() * artists.length);
  const selectedArtist = artists[randomIndex];

  // 2. Return the artist data.
  return selectedArtist;
}
