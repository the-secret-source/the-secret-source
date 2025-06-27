import { getArtists } from "@/data/artists";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Music, Users, Link2Off } from "lucide-react";

export function AppSidebar() {
  const artists = getArtists();
  const artistCount = artists.length;
  const trackCount = artists.reduce((sum, artist) => sum + artist.tracks.length, 0);

  const artistsWithLinks = artists.filter(artist => {
    // An artist has links if they have a page link OR any of their tracks have a link.
    const hasArtistPageLink = artist.bandcampUrl || artist.spotifyUrl || artist.youtubeUrl || artist.discogsUrl || (artist.otherLinks && artist.otherLinks.length > 0);
    const hasTrackLink = artist.tracks.some(track => track.bandcampUrl || track.spotifyUrl);
    return hasArtistPageLink || hasTrackLink;
  }).length;
  
  const artistsWithoutLinks = artistCount - artistsWithLinks;
  const artistsWithoutLinksPercentage = artistCount > 0 ? Math.round((artistsWithoutLinks / artistCount) * 100) : 0;
  
  const tracksWithLinks = artists.reduce((sum, artist) => {
      return sum + artist.tracks.filter(track => track.bandcampUrl || track.spotifyUrl).length;
  }, 0);
  const tracksWithoutLinks = trackCount - tracksWithLinks;
  const tracksWithoutLinksPercentage = trackCount > 0 ? Math.round((tracksWithoutLinks / trackCount) * 100) : 0;

  return (
    <Sidebar>
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
                      <Link2Off className="h-5 w-5 text-sidebar-foreground/70" />
                      <span className="text-sidebar-foreground/90 text-sm group-data-[collapsible=icon]:hidden">Artists without links</span>
                  </div>
                  <span className="font-mono font-semibold group-data-[collapsible=icon]:hidden">{artistsWithoutLinks}</span>
              </div>
              <Progress value={artistsWithoutLinksPercentage} className="h-2 group-data-[collapsible=icon]:hidden" />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex flex-col w-full p-2 space-y-2 group-data-[collapsible=icon]:items-center">
              <div className="flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center">
                  <div className="flex items-center gap-3">
                      <Link2Off className="h-5 w-5 text-sidebar-foreground/70" />
                      <span className="text-sidebar-foreground/90 text-sm group-data-[collapsible=icon]:hidden">Tracks without links</span>
                  </div>
                  <span className="font-mono font-semibold group-data-[collapsible=icon]:hidden">{tracksWithoutLinks}</span>
              </div>
              <Progress value={tracksWithoutLinksPercentage} className="h-2 group-data-[collapsible=icon]:hidden" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
