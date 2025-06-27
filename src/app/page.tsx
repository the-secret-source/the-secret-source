import { MainLayout } from '@/components/main-layout';
import { getArtists, getDatasetNames } from '@/data/artists';

export default function Home() {
  const artists = getArtists();
  const allDatasetNames = getDatasetNames();

  const artistCount = artists.length;
  const trackCount = artists.reduce((sum, artist) => sum + artist.tracks.length, 0);

  const paidLinkKeys = ['bandcampUrl', 'spotifyUrl', 'appleMusicUrl', 'discogsUrl'];

  const artistsWithPaidLinks = artists.filter(artist => {
    const hasArtistPageLink = paidLinkKeys.some(key => !!artist[key]);
    const hasTrackLink = artist.tracks.some(track => paidLinkKeys.some(key => !!track[key]));
    return hasArtistPageLink || hasTrackLink;
  }).length;

  const artistsWithPaidLinksPercentage = artistCount > 0 ? Math.round((artistsWithPaidLinks / artistCount) * 100) : 0;
  
  const tracksWithPaidLinks = artists.reduce((sum, artist) => {
    return sum + artist.tracks.filter(track => paidLinkKeys.some(key => !!track[key])).length;
  }, 0);

  const tracksWithPaidLinksPercentage = trackCount > 0 ? Math.round((tracksWithPaidLinks / trackCount) * 100) : 0;

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
    artistsWithPaidLinks,
    artistsWithPaidLinksPercentage,
    tracksWithPaidLinks,
    tracksWithPaidLinksPercentage,
    datasetCounts,
  };

  return <MainLayout allDatasetNames={allDatasetNames} stats={stats} />;
}
