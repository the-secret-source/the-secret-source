export interface Track {
  title: string;
  dataset: string;
  source?: string;
  bandcampUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  discogsUrl?: string;
  [key: string]: any;
}

export interface Artist {
  artistName: string;
  tracks: Track[];
  bandcampUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  appleMusicUrl?: string;
  discogsUrl?: string;
  otherLinks?: string[];
  [key: string]: any;
}
