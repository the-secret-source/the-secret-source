'use server';

/**
 * @fileOverview A flow to select a random artist from a curated list.
 *
 * - getRandomArtist - A function that returns a random artist's information.
 * - RandomArtistOutput - The output type for the getRandomArtist function.
 */

import { z } from 'genkit';
import { artists } from '@/data/artists';
import { generateArtistProfile } from './artist-profile-generator';
import { findArtistLinks } from './find-artist-links';
import { ai } from '@/ai/genkit';

const RandomArtistOutputSchema = z.object({
  artistName: z.string().describe('The name of the artist.'),
  bio: z.string().describe('A brief biography of the artist.'),
  tracks: z.array(z.object({
    title: z.string().describe("The title of the track."),
    dataset: z.string().describe("The dataset the track appeared in."),
  })).describe('A list of tracks by the artist, including the dataset they appeared in.'),
  bandcampUrl: z.string().optional().describe('The URL of the artist on Bandcamp, if available.'),
  spotifyUrl: z.string().optional().describe('The URL of the artist on Spotify, if available.'),
  youtubeUrl: z.string().optional().describe('The URL of the artist on YouTube, if available.'),
  otherLinks: z.array(z.string()).optional().describe('Other relevant links related to the artist.'),
});
export type RandomArtistOutput = z.infer<typeof RandomArtistOutputSchema>;

export async function getRandomArtist(): Promise<RandomArtistOutput> {
  return randomArtistFlow();
}

const randomArtistFlow = ai.defineFlow(
  {
    name: 'randomArtistFlow',
    outputSchema: RandomArtistOutputSchema,
  },
  async () => {
    // 1. Select a random artist from the curated list.
    const randomIndex = Math.floor(Math.random() * artists.length);
    const selectedArtist = artists[randomIndex];

    // 2. Generate a bio for the artist in parallel.
    const profilePromise = generateArtistProfile({
      artistName: selectedArtist.artistName,
      artistGenre: selectedArtist.genre,
    });

    // 3. If links are missing, search for them in parallel.
    const linksPromise =
      selectedArtist.bandcampUrl || selectedArtist.spotifyUrl || selectedArtist.youtubeUrl
        ? Promise.resolve({
            bandcampUrl: selectedArtist.bandcampUrl,
            spotifyUrl: selectedArtist.spotifyUrl,
            youtubeUrl: selectedArtist.youtubeUrl,
            otherLinks: selectedArtist.otherLinks,
          })
        : findArtistLinks({
            artistName: selectedArtist.artistName,
            artistGenre: selectedArtist.genre,
          });

    const [profile, links] = await Promise.all([profilePromise, linksPromise]);

    // 4. Combine data and return.
    return {
      artistName: selectedArtist.artistName,
      bio: profile.bio,
      tracks: selectedArtist.tracks,
      bandcampUrl: selectedArtist.bandcampUrl || links.bandcampUrl,
      spotifyUrl: selectedArtist.spotifyUrl || links.spotifyUrl,
      youtubeUrl: selectedArtist.youtubeUrl || links.youtubeUrl,
      otherLinks: selectedArtist.otherLinks || links.otherLinks,
    };
  }
);
