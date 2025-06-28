
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AppSidebar, type AppSidebarStats } from '@/components/app-sidebar';
import { HomePage } from '@/components/home-page';
import { SidebarInset } from '@/components/ui/sidebar';
import type { Artist } from '@/lib/types';

interface MainLayoutProps {
  allDatasetNames: string[];
  artists: Artist[];
}

export function MainLayout({ allDatasetNames, artists }: MainLayoutProps) {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [selectedLinkTypes, setSelectedLinkTypes] = useState<string[]>(['bandcampUrl', 'discogsUrl']);
  
  useEffect(() => {
    setSelectedDatasets(allDatasetNames);
  }, [allDatasetNames]);

  const stats: AppSidebarStats = useMemo(() => {
    const filteredArtists = selectedDatasets.length >= allDatasetNames.length
      ? artists
      : artists.map(artist => {
          const tracksInSelectedDatasets = artist.tracks.filter(track =>
            selectedDatasets.includes(track.dataset)
          );
          if (tracksInSelectedDatasets.length > 0) {
            return { ...artist, tracks: tracksInSelectedDatasets };
          }
          return null;
        }).filter((artist): artist is Artist => artist !== null);
    
    const allTracks = filteredArtists.flatMap(a => a.tracks);
    const artistCount = filteredArtists.length;
    const trackCount = allTracks.length;

    const directSupportKeys = ['bandcampUrl', 'discogsUrl'];
    const definitelyMonetizedKeys = ['spotifyUrl', 'appleMusicUrl'];
    const potentiallyMonetizedKeys = ['youtubeUrl', 'soundcloudUrl'];
    
    const primaryLinkKeys = new Set([
      ...directSupportKeys,
      ...definitelyMonetizedKeys,
      ...potentiallyMonetizedKeys
    ]);

    const getCategory = (obj: any): string => {
      if (directSupportKeys.some(key => obj[key])) return 'direct';
      if (definitelyMonetizedKeys.some(key => obj[key])) return 'definitelyMonetized';
      if (potentiallyMonetizedKeys.some(key => obj[key])) return 'potentiallyMonetized';
      
      for (const key in obj) {
        if (key.endsWith('Url') && !primaryLinkKeys.has(key) && obj[key]) {
          return 'other';
        }
      }
      if (Array.isArray(obj.otherLinks) && obj.otherLinks.length > 0) {
        return 'other';
      }

      return 'none';
    }

    const getArtistCategory = (artist: Artist): string => {
      const artistCategory = getCategory(artist);
      if (artistCategory !== 'none') return artistCategory;

      const trackCategories = artist.tracks.map(getCategory);
      if (trackCategories.includes('direct')) return 'direct';
      if (trackCategories.includes('definitelyMonetized')) return 'definitelyMonetized';
      if (trackCategories.includes('potentiallyMonetized')) return 'potentiallyMonetized';
      if (trackCategories.includes('other')) return 'other';
      
      return 'none';
    };

    const artistsCategorized = filteredArtists.map(getArtistCategory);

    const artistsWithDirectSupport = artistsCategorized.filter(c => c === 'direct').length;
    const artistsWithDefinitelyMonetized = artistsCategorized.filter(c => c === 'definitelyMonetized').length;
    const artistsWithPotentiallyMonetized = artistsCategorized.filter(c => c === 'potentiallyMonetized').length;
    const artistsWithOther = artistsCategorized.filter(c => c === 'other').length;

    const tracksCategorized = allTracks.map(getCategory);
    
    const tracksWithDirectSupport = tracksCategorized.filter(c => c === 'direct').length;
    const tracksWithDefinitelyMonetized = tracksCategorized.filter(c => c === 'definitelyMonetized').length;
    const tracksWithPotentiallyMonetized = tracksCategorized.filter(c => c === 'potentiallyMonetized').length;
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

    return {
      artistCount,
      trackCount,
      artistsWithDirectSupport,
      artistsWithDefinitelyMonetized,
      artistsWithPotentiallyMonetized,
      artistsWithOther,
      artistsWithDirectSupportPercentage: artistCount > 0 ? Math.round((artistsWithDirectSupport / artistCount) * 100) : 0,
      artistsWithDefinitelyMonetizedPercentage: artistCount > 0 ? Math.round((artistsWithDefinitelyMonetized / artistCount) * 100) : 0,
      artistsWithPotentiallyMonetizedPercentage: artistCount > 0 ? Math.round((artistsWithPotentiallyMonetized / artistCount) * 100) : 0,
      artistsWithOtherPercentage: artistCount > 0 ? Math.round((artistsWithOther / artistCount) * 100) : 0,
      tracksWithDirectSupport,
      tracksWithDefinitelyMonetized,
      tracksWithPotentiallyMonetized,
      tracksWithOther,
      tracksWithDirectSupportPercentage: trackCount > 0 ? Math.round((tracksWithDirectSupport / trackCount) * 100) : 0,
      tracksWithDefinitelyMonetizedPercentage: trackCount > 0 ? Math.round((tracksWithDefinitelyMonetized / trackCount) * 100) : 0,
      tracksWithPotentiallyMonetizedPercentage: trackCount > 0 ? Math.round((tracksWithPotentiallyMonetized / trackCount) * 100) : 0,
      tracksWithOtherPercentage: trackCount > 0 ? Math.round((tracksWithOther / trackCount) * 100) : 0,
      datasetCounts,
    };
  }, [artists, selectedDatasets, allDatasetNames]);

  const handleDatasetToggle = (datasetName: string) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetName)
        ? prev.filter(d => d !== datasetName)
        : [...prev, datasetName]
    );
  };

  const handleLinkTypeToggle = (linkType: string) => {
    setSelectedLinkTypes(prev =>
      prev.includes(linkType)
        ? prev.filter(t => t !== linkType)
        : [...prev, linkType]
    );
  };

  return (
    <>
      <AppSidebar 
        stats={stats}
        allDatasetNames={allDatasetNames} 
        selectedDatasets={selectedDatasets}
        onDatasetToggle={handleDatasetToggle}
        selectedLinkTypes={selectedLinkTypes}
        onLinkTypeToggle={handleLinkTypeToggle}
      />
      <SidebarInset>
        <HomePage selectedDatasets={selectedDatasets} selectedLinkTypes={selectedLinkTypes} />
      </SidebarInset>
    </>
  );
}
