import { MainLayout } from '@/components/main-layout';
import { getArtists, getDatasetNames } from '@/data/artists';

export default function Home() {
  const artists = getArtists();
  const allDatasetNames = getDatasetNames();

  return <MainLayout allDatasetNames={allDatasetNames} artists={artists} />;
}
