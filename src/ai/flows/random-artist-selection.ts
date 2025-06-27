'use server';

/**
 * @fileOverview A flow to select a random artist from a curated list of open-source music datasets, prioritizing lesser-known artists.
 *
 * - getRandomArtist - A function that returns a random artist's information.
 * - RandomArtistOutput - The output type for the getRandomArtist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RandomArtistOutputSchema = z.object({
  artistName: z.string().describe('The name of the artist.'),
  bio: z.string().describe('A brief biography of the artist.'),
  bandcampUrl: z.string().optional().describe('The URL of the artist on Bandcamp, if available.'),
  spotifyUrl: z.string().optional().describe('The URL of the artist on Spotify, if available.'),
  youtubeUrl: z.string().optional().describe('The URL of the artist on YouTube, if available.'),
  otherLinks: z.array(z.string()).optional().describe('Other relevant links related to the artist.'),
});
export type RandomArtistOutput = z.infer<typeof RandomArtistOutputSchema>;

export async function getRandomArtist(): Promise<RandomArtistOutput> {
  return randomArtistSelectionFlow();
}

const prompt = ai.definePrompt({
  name: 'randomArtistSelectionPrompt',
  output: {schema: RandomArtistOutputSchema},
  prompt: `You are an AI assistant designed to help users discover new music. Your task is to select a random artist from a curated list of open-source music datasets and provide a brief profile of the artist.

  The profile should include the artist's name, a short bio, and links to their music profiles on platforms like Bandcamp, Spotify, and YouTube, when possible. Prioritize artists who may benefit from additional exposure, considering factors like obscurity and number of streams.

  Return the data in JSON format based on the schema description. Try to provide links to Bandcamp, Spotify and Youtube if they are available.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const randomArtistSelectionFlow = ai.defineFlow(
  {
    name: 'randomArtistSelectionFlow',
    outputSchema: RandomArtistOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
