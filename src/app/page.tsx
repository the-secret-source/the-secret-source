import { MainLayout } from '@/components/main-layout';
import { getArtists, getDatasetNames } from '@/data/artists';
import type { Artist, Track } from '@/lib/types';

export default function Home() {
  const artists = getArtists();
  const allDatasetNames = getDatasetNames();

  const artistCount = artists.length;
  const allTracks = artists.flatMap(a => a.tracks);
  const trackCount = allTracks.length;

  const directSupportKeys = ['bandcampUrl', 'discogsUrl'];
  const streamingKeys = ['spotifyUrl', 'appleMusicUrl'];
  const otherLinkKeys = ['youtubeUrl', 'otherLinks', 'soundcloudUrl', 'weathervaneUrl', 'mixRescueUrl'];

  const hasLink = (obj: any, keys: string[]) => {
    if (!obj) return false;
    return keys.some(key => {
      if (key === 'otherLinks') {
        return Array.isArray(obj[key]) && obj[key].length > 0;
      }
      return !!obj[key];
    });
  }

  // Categorize Artists based on the best available link
  const artistsCategorized = artists.map(artist => {
    const hasArtistDirectLink = hasLink(artist, directSupportKeys);
    const hasTrackDirectLink = artist.tracks.some(track => hasLink(track, directSupportKeys));
    if (hasArtistDirectLink || hasTrackDirectLink) return 'direct';

    const hasArtistStreamingLink = hasLink(artist, streamingKeys);
    const hasTrackStreamingLink = artist.tracks.some(track => hasLink(track, streamingKeys));
    if (hasArtistStreamingLink || hasTrackStreamingLink) return 'streaming';

    const hasArtistOtherLink = hasLink(artist, otherLinkKeys);
    const hasTrackOtherLink = artist.tracks.some(track => hasLink(track, otherLinkKeys));
    if (hasArtistOtherLink || hasTrackOtherLink) return 'other';

    return 'none';
  });

  const artistsWithDirectSupport = artistsCategorized.filter(c => c === 'direct').length;
  const artistsWithStreaming = artistsCategorized.filter(c => c === 'streaming').length;
  const artistsWithOther = artistsCategorized.filter(c => c === 'other').length;

  // Categorize Tracks based on the best available link
  const tracksCategorized = allTracks.map(track => {
    if (hasLink(track, directSupportKeys)) return 'direct';
    if (hasLink(track, streamingKeys)) return 'streaming';
    if (hasLink(track, otherLinkKeys)) return 'other';
    return 'none';
  });
  
  const tracksWithDirectSupport = tracksCategorized.filter(c => c === 'direct').length;
  const tracksWithStreaming = tracksCategorized.filter(c => c === 'streaming').length;
  const tracksWithOther = tracksCategorized.filter(c => c === 'other').length;
  
  const datasetCounts = allDatasetNames.reduce((acc, name) => {
    const artistsInDataset = new Set<string>();
    let tracksInDataset = 0;
    artists.forEach(artist => {
      const artistTracksInDataset = artist.tracks.filter(track => track.dataset === name);
      if (artistTracksInDataset.length > 0) {
        artistsInDataset.add(artist.artistName);
        tracksInDataset += artistTracksInDataset.length;
      }
    });
    acc[name] = {
      artists: artistsInDataset.size,
      tracks: tracksInDataset,
    };
    return acc;
  }, {} as Record<string, { artists: number; tracks: number }>);

  const stats = {
    artistCount,
    trackCount,
    artistsWithDirectSupport,
    artistsWithStreaming,
    artistsWithOther,
    artistsWithDirectSupportPercentage: artistCount > 0 ? Math.round((artistsWithDirectSupport / artistCount) * 100) : 0,
    artistsWithStreamingPercentage: artistCount > 0 ? Math.round((artistsWithStreaming / artistCount) * 100) : 0,
    artistsWithOtherPercentage: artistCount > 0 ? Math.round((artistsWithOther / artistCount) * 100) : 0,
    tracksWithDirectSupport,
    tracksWithStreaming,
    tracksWithOther,
    tracksWithDirectSupportPercentage: trackCount > 0 ? Math.round((tracksWithDirectSupport / trackCount) * 100) : 0,
    tracksWithStreamingPercentage: trackCount > 0 ? Math.round((tracksWithStreaming / trackCount) * 100) : 0,
    tracksWithOtherPercentage: trackCount > 0 ? Math.round((tracksWithOther / trackCount) * 100) : 0,
    datasetCounts,
  };

  return <MainLayout allDatasetNames={allDatasetNames} stats={stats} />;
}
