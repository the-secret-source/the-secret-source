import type { Artist } from './artists';

export const communityArtists: Artist[] = [
  {
    artistName: 'Synth-Savant',
    genre: 'Darksynth',
    bandcampUrl: 'https://synthsavant.bandcamp.com/',
    tracks: [
        { title: 'Midnight Drive', dataset: 'FMA' },
        { title: 'Neon Grid', dataset: 'CC-Mixter' },
    ]
  },
  {
    artistName: 'Acoustic-Echoes',
    genre: 'Folk',
    youtubeUrl: 'https://youtube.com/acousticechoes',
    tracks: [
        { title: 'Whispering Pines', dataset: 'Jamendo' },
    ]
  },
];
