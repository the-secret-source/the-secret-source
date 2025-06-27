/**
 * @fileOverview Mock data for the MUSDB-18 dataset.
 * This file contains a simplified, curated tracklist for demonstration purposes.
 * The format is [Track Title, Artist Name, Genre, OptionalTrackLinks].
 * OptionalTrackLinks is an object: { bandcampUrl?: string; spotifyUrl?: string }.
 */
export const musdb18Tracklist: [string, string, string, { bandcampUrl?: string; spotifyUrl?: string }?][] = [
  ['Goodbye Bolero', 'Alexander Ross', 'Pop', { bandcampUrl: 'https://alexanderross.bandcamp.com/track/goodbye-bolero' }],
  ['Rockshow', 'Kangoro', 'Rock'],
  ['One Minute Smile', 'Actions', 'Alternative Rock'],
  ['Run', 'Arise', 'Metal'],
  ['The End', 'Ben Carr', 'Pop Rock', { spotifyUrl: 'https://open.spotify.com/track/0Sqqz4zEX3a41aA2i3aBqg' }],
  ['On The Line', 'James May', 'Pop Rock'],
  ['Whisper To A Scream', 'Johnny Lokke', 'Rock'],
  ['Summerdays', 'Leaf', 'Pop'],
  ['Unsafe', 'Quiet Music for Tiny Robots', 'Ambient'],
  ['Atrophy', 'The Doppler Shift', 'Alternative Rock'],
  ['Angels To Some', 'Triviul', 'Metal'],
  ['Pennies', 'Young Griffo', 'Indie Rock'],
];
