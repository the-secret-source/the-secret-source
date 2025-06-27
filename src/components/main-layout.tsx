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
  const [withLinksOnly, setWithLinksOnly] = useState<boolean>(false);
  
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

  const handleWithLinksOnlyToggle = () => {
    setWithLinksOnly(prev => !prev);
  }

  return (
    <>
      <AppSidebar 
        stats={stats}
        allDatasetNames={allDatasetNames} 
        selectedDatasets={selectedDatasets}
        onDatasetToggle={handleDatasetToggle}
        withLinksOnly={withLinksOnly}
        onWithLinksOnlyToggle={handleWithLinksOnlyToggle}
      />
      <SidebarInset>
        <HomePage selectedDatasets={selectedDatasets} withLinksOnly={withLinksOnly} />
      </SidebarInset>
    </>
  );
}
