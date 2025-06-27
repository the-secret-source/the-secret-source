/**
 * @fileOverview Curated list of artists for discovery.
 * This file is intended to be the single source of truth for the artists
 * featured in the app, making it easy for open-source contributions.
 */

export interface Artist {
  artistName: string;
  genre: string;
  bandcampUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  otherLinks?: string[];
}

export const artists: Artist[] = [
  {
    artistName: 'Laser-Gun',
    genre: 'Synthwave',
    bandcampUrl: 'https://laser-gun.bandcamp.com/',
    spotifyUrl: 'https://open.spotify.com/artist/3sKaq2k1gK3i2B1e3i2B1e',
    youtubeUrl: 'https://www.youtube.com/channel/UC-123-ABC',
  },
  {
    artistName: 'Pixel-Dreams',
    genre: 'Chiptune',
    bandcampUrl: 'https://pixel-dreams.bandcamp.com/',
    otherLinks: ['https://soundcloud.com/pixel-dreams'],
  },
  {
    artistName: 'Ocean-Currents',
    genre: 'Ambient',
    youtubeUrl: 'https://www.youtube.com/channel/UC-456-DEF',
  },
  {
      artistName: 'Cosmic-Voyager',
      genre: 'Space Rock',
      spotifyUrl: 'https://open.spotify.com/artist/4tKaq2k1gK3i2B1e3i2B1f',
      bandcampUrl: 'https://cosmic-voyager.bandcamp.com/',
  }
];
