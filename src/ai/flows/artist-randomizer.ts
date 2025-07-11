'use server';

/**
 * @fileOverview A function to select a random artist from a curated list.
 *
 * - getRandomArtist - A function that returns a random artist's information.
 */

import { getArtists } from '@/data/artists';
import type { Artist } from '@/lib/types';

export async function getRandomArtist(filters?: { datasets?: string[], linkTypes?: string[] }): Promise<Artist | null> {
  const artists = getArtists(filters);
  if (!artists || artists.length === 0) {
    console.error("Artist data is empty or filtered list is empty. Cannot select a random artist.");
    return null;
  }
  // 1. Select a random artist from the curated list.
  const randomIndex = Math.floor(Math.random() * artists.length);
  const selectedArtist = artists[randomIndex];

  // 2. Return the artist data.
  return selectedArtist;
}
