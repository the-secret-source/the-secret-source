import { MainLayout } from '@/components/main-layout';
import { getArtists, getDatasetNames } from '@/data/artists';

export default function Home() {
  const artists = getArtists();
  const allDatasetNames = getDatasetNames();

  const artistCount = artists.length;
  const trackCount = artists.reduce((sum, artist) => sum + artist.tracks.length, 0);

  const artistsWithLinks = artists.filter(artist => {
    const hasArtistPageLink = artist.bandcampUrl || artist.spotifyUrl || artist.youtubeUrl || artist.discogsUrl || (artist.otherLinks && artist.otherLinks.length > 0);
    const hasTrackLink = artist.tracks.some(track => track.bandcampUrl || track.spotifyUrl);
    return hasArtistPageLink || hasTrackLink;
  }).length;
  
  const artistsWithLinksPercentage = artistCount > 0 ? Math.round((artistsWithLinks / artistCount) * 100) : 0;
  
  const tracksWithLinks = artists.reduce((sum, artist) => {
      return sum + artist.tracks.filter(track => track.bandcampUrl || track.spotifyUrl).length;
  }, 0);

  const tracksWithLinksPercentage = trackCount > 0 ? Math.round((tracksWithLinks / trackCount) * 100) : 0;

  const datasetCounts = allDatasetNames.reduce((acc, name) => {
    const artistsInDataset = new Set<string>();
    artists.forEach(artist => {
      if (artist.tracks.some(track => track.dataset === name)) {
        artistsInDataset.add(artist.artistName);
      }
    });
    acc[name] = artistsInDataset.size;
    return acc;
  }, {} as Record<string, number>);

  const stats = {
    artistCount,
    trackCount,
    artistsWithLinks,
    artistsWithLinksPercentage,
    tracksWithLinks,
    tracksWithLinksPercentage,
    datasetCounts,
  };

  return <MainLayout allDatasetNames={allDatasetNames} stats={stats} />;
}
