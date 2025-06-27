'use server';
/**
 * @fileOverview A flow to find official links for a given artist.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindArtistLinksInputSchema = z.object({
  artistName: z.string().describe('The name of the artist.'),
});
export type FindArtistLinksInput = z.infer<typeof FindArtistLinksInputSchema>;

const FindArtistLinksOutputSchema = z.object({
  bandcampUrl: z.string().optional().describe("The URL of the artist's Bandcamp page."),
  spotifyUrl: z.string().optional().describe("The URL of the artist's Spotify page."),
  youtubeUrl: z.string().optional().describe("The URL of the artist's YouTube channel."),
  otherLinks: z.array(z.string()).optional().describe('Other relevant official links.'),
});
export type FindArtistLinksOutput = z.infer<typeof FindArtistLinksOutputSchema>;

export async function findArtistLinks(input: FindArtistLinksInput): Promise<FindArtistLinksOutput> {
  return findArtistLinksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findArtistLinksPrompt',
  input: {schema: FindArtistLinksInputSchema},
  output: {schema: FindArtistLinksOutputSchema},
  prompt: `You are a music research assistant. Your task is to find official web pages for a given artist.

  Prioritize finding a Bandcamp page. Also look for Spotify and YouTube pages. Only return high-confidence, official links. Do not return links to fan pages, social media profiles (like Twitter or Facebook), or music databases like Discogs.

  Artist Name: {{artistName}}

  Return the data in the specified JSON format. If you cannot find a link for a specific platform, omit the field.`,
});

const findArtistLinksFlow = ai.defineFlow(
  {
    name: 'findArtistLinksFlow',
    inputSchema: FindArtistLinksInputSchema,
    outputSchema: FindArtistLinksOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
