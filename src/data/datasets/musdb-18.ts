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
  ['Drive', 'Ben Carr', 'Pop Rock'],
  ['On The Line', 'James May', 'Pop Rock'],
  ['Whisper To A Scream', 'Johnny Lokke', 'Rock'],
  ['Summerdays', 'Leaf', 'Pop'],
  ['Unsafe', 'Quiet Music for Tiny Robots', 'Ambient'],
  ['Atrophy', 'The Doppler Shift', 'Alternative Rock'],
  ['Angels To Some', 'Triviul', 'Metal'],
  ['Pennies', 'Young Griffo', 'Indie Rock'],
  ['On Me', 'Aimee Allen', 'Pop Rock'],
  ['Stella', 'Clara Berry And Wooldog', 'Rock'],
  ['A Reason To Leave', 'Patrick Talbot', 'Pop'],
  ['Alabaster', 'The Bony King Of Nowhere', 'Indie Folk'],
  ['Signs', 'Zeno', 'Pop Rock'],
  ['Thinking Of You', 'The Easton Ellises', 'Alternative Rock'],
  ['Let Go', 'AM', 'Rock'],
];
