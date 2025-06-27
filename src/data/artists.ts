/**
 * @fileOverview Curated list of artists for discovery.
 * This file is intended to be the single source of truth for the artists
 * featured in the app, making it easy for open-source contributions.
 * To add more artists, you can either add to the 'curatedArtists' list
 * in this file, or create a new file and import it here, adding it to the
 * final 'artists' export.
 */
import { communityArtists } from './community-artists';

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

const curatedArtists: Artist[] = [
  {
    artistName: 'Laser-Gun',
    genre: 'Synthwave',
    bandcampUrl: 'https://laser-gun.bandcamp.com/',
    spotifyUrl: 'https://open.spotify.com/artist/3sKaq2k1gK3i2B1e3i2B1e',
    youtubeUrl: 'https://www.youtube.com/channel/UC-123-ABC',
    tracks: [
      { title: 'Nightfall', dataset: 'FMA (Free Music Archive)' },
      { title: 'Gridrunner', dataset: 'CC-Mixter' },
    ],
  },
  {
    artistName: 'Pixel-Dreams',
    genre: 'Chiptune',
    bandcampUrl: 'https://pixel-dreams.bandcamp.com/',
    otherLinks: ['https://soundcloud.com/pixel-dreams'],
    tracks: [
        { title: '8-Bit Adventure', dataset: 'Jamendo' },
        { title: 'Castle Quest', dataset: 'FMA' }
    ],
  },
  {
    artistName: 'Ocean-Currents',
    genre: 'Ambient',
    youtubeUrl: 'https://www.youtube.com/channel/UC-456-DEF',
    tracks: [
        { title: 'Deep Dive', dataset: 'SoundCloud (CC)'}
    ],
  },
  {
      artistName: 'Cosmic-Voyager',
      genre: 'Space Rock',
      spotifyUrl: 'https://open.spotify.com/artist/4tKaq2k1gK3i2B1e3i2B1f',
      bandcampUrl: 'https://cosmic-voyager.bandcamp.com/',
      tracks: [
          { title: 'Starlight', dataset: 'Bandcamp (CC)'},
          { title: 'Nebula', dataset: 'FMA'}
      ]
  }
];

export const artists: Artist[] = [...curatedArtists, ...communityArtists];
