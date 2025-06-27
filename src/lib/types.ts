export interface Track {
  title: string;
  dataset: string;
  source?: string;
  bandcampUrl?: string;
  spotifyUrl?: string;
  discogsUrl?: string;
}

export interface Artist {
  artistName: string;
  genre: string;
  tracks: Track[];
  bandcampUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  discogsUrl?: string;
  otherLinks?: string[];
}
