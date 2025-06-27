'use client';

import { useState, useEffect } from 'react';
import { AppSidebar, type AppSidebarStats } from '@/components/app-sidebar';
import { HomePage } from '@/components/home-page';
import { SidebarInset } from '@/components/ui/sidebar';

interface MainLayoutProps {
  allDatasetNames: string[];
  stats: AppSidebarStats;
}

export function MainLayout({ allDatasetNames, stats }: MainLayoutProps) {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [selectedLinkTypes, setSelectedLinkTypes] = useState<string[]>(['direct', 'streaming', 'other']);
  
  useEffect(() => {
    setSelectedDatasets(allDatasetNames);
  }, [allDatasetNames]);

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
