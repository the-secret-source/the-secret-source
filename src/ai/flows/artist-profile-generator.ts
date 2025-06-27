'use server';

/**
 * @fileOverview A flow to generate a short bio for a randomly selected artist.
 *
 * - generateArtistProfile - A function that handles the artist profile generation process.
 * - GenerateArtistProfileInput - The input type for the generateArtistProfile function.
 * - GenerateArtistProfileOutput - The return type for the generateArtistProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArtistProfileInputSchema = z.object({
  artistName: z.string().describe('The name of the artist.'),
  artistGenre: z.string().describe('The genre of music the artist performs.'),
});
export type GenerateArtistProfileInput = z.infer<typeof GenerateArtistProfileInputSchema>;

const GenerateArtistProfileOutputSchema = z.object({
  bio: z.string().describe('A short, AI-generated bio for the artist.'),
});
export type GenerateArtistProfileOutput = z.infer<typeof GenerateArtistProfileOutputSchema>;

export async function generateArtistProfile(input: GenerateArtistProfileInput): Promise<GenerateArtistProfileOutput> {
  return generateArtistProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArtistProfilePrompt',
  input: {schema: GenerateArtistProfileInputSchema},
  output: {schema: GenerateArtistProfileOutputSchema},
  prompt: `You are a music journalist who writes short bios for artists.

  Given the artist's name and genre, write a one-sentence bio.

  Artist Name: {{artistName}}
  Genre: {{artistGenre}}`,
});

const generateArtistProfileFlow = ai.defineFlow(
  {
    name: 'generateArtistProfileFlow',
    inputSchema: GenerateArtistProfileInputSchema,
    outputSchema: GenerateArtistProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
