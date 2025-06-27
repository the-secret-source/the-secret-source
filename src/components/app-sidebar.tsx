'use client';

import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarTrigger, SidebarRail, SidebarSeparator, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Music, Users, Link, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface AppSidebarStats {
  artistCount: number;
  trackCount: number;
  artistsWithLinks: number;
  artistsWithLinksPercentage: number;
  tracksWithLinks: number;
  tracksWithLinksPercentage: number;
}

interface AppSidebarProps {
  stats: AppSidebarStats;
  allDatasetNames: string[];
  selectedDatasets: string[];
  onDatasetToggle: (datasetName: string) => void;
}

export function AppSidebar({ stats, allDatasetNames, selectedDatasets, onDatasetToggle }: AppSidebarProps) {
  const { artistCount, trackCount, artistsWithLinks, artistsWithLinksPercentage, tracksWithLinks, tracksWithLinksPercentage } = stats;

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="flex items-center justify-between p-2">
        <h2 className="pl-2 text-xl font-semibold text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden">
          Stats
        </h2>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex items-center justify-between w-full p-2 group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-sidebar-foreground/70" />
                    <span className="text-sidebar-foreground/90 group-data-[collapsible=icon]:hidden">Total Artists</span>
                </div>
                <span className="font-mono font-semibold text-lg group-data-[collapsible=icon]:hidden">{artistCount}</span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex items-center justify-between w-full p-2 group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-sidebar-foreground/70" />
                    <span className="text-sidebar-foreground/90 group-data-[collapsible=icon]:hidden">Total Tracks</span>
                </div>
                <span className="font-mono font-semibold text-lg group-data-[collapsible=icon]:hidden">{trackCount}</span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex flex-col w-full p-2 space-y-2 group-data-[collapsible=icon]:items-center">
              <div className="flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center">
                  <div className="flex items-center gap-3">
                      <Link className="h-5 w-5 text-sidebar-foreground/70" />
                      <span className="text-sidebar-foreground/90 text-sm group-data-[collapsible=icon]:hidden">Artists with links</span>
                  </div>
                  <span className="font-mono font-semibold group-data-[collapsible=icon]:hidden">{artistsWithLinks}</span>
              </div>
              <Progress value={artistsWithLinksPercentage} className="h-2 group-data-[collapsible=icon]:hidden [&>div]:bg-accent" />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex flex-col w-full p-2 space-y-2 group-data-[collapsible=icon]:items-center">
              <div className="flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center">
                  <div className="flex items-center gap-3">
                      <Link className="h-5 w-5 text-sidebar-foreground/70" />
                      <span className="text-sidebar-foreground/90 text-sm group-data-[collapsible=icon]:hidden">Tracks with links</span>
                  </div>
                  <span className="font-mono font-semibold group-data-[collapsible=icon]:hidden">{tracksWithLinks}</span>
              </div>
              <Progress value={tracksWithLinksPercentage} className="h-2 group-data-[collapsible=icon]:hidden [&>div]:bg-accent" />
            </div>
          </SidebarMenuItem>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter by Dataset
            </SidebarGroupLabel>
            <div className="flex flex-col gap-2 pt-2 group-data-[collapsible=icon]:hidden">
              {allDatasetNames.map(name => (
                <div key={name} className="flex items-center space-x-2 pl-2">
                  <Checkbox 
                    id={name} 
                    checked={selectedDatasets.includes(name)}
                    onCheckedChange={() => onDatasetToggle(name)}
                  />
                  <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sidebar-foreground/90">
                    {name}
                  </Label>
                </div>
              ))}
            </div>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
