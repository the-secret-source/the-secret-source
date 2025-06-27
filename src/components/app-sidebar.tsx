import { getArtists } from "@/data/artists";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarTrigger, SidebarRail } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Music, Users, Link } from "lucide-react";

export function AppSidebar() {
  const artists = getArtists();
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
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}