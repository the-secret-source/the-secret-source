import { artists } from "@/data/artists";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Music, Users, Link, Link2Off } from "lucide-react";

export function AppSidebar() {
  const artistCount = artists.length;
  const trackCount = artists.reduce((sum, artist) => sum + artist.tracks.length, 0);

  const artistsWithLinks = artists.filter(artist => {
    // An artist is considered to have links if any of their tracks in the dataset has a link.
    const hasTrackLink = artist.tracks.some(track => track.bandcampUrl || track.spotifyUrl);
    return hasTrackLink;
  }).length;

  const artistsWithoutLinks = artistCount - artistsWithLinks;

  return (
    <Sidebar>
      <SidebarHeader className="text-center">
        <h2 className="text-xl font-semibold text-sidebar-foreground/80 pt-2">Stats</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex items-center justify-between w-full p-2">
                <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-sidebar-foreground/70" />
                    <span className="text-sidebar-foreground/90">Artists</span>
                </div>
                <span className="font-mono font-semibold text-lg">{artistCount}</span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex items-center justify-between w-full p-2">
                <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-sidebar-foreground/70" />
                    <span className="text-sidebar-foreground/90">Tracks</span>
                </div>
                <span className="font-mono font-semibold text-lg">{trackCount}</span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex items-center justify-between w-full p-2">
                <div className="flex items-center gap-3">
                    <Link className="h-5 w-5 text-sidebar-foreground/70" />
                    <span className="text-sidebar-foreground/90">With Links</span>
                </div>
                <span className="font-mono font-semibold text-lg">{artistsWithLinks}</span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pointer-events-none">
            <div className="flex items-center justify-between w-full p-2">
                <div className="flex items-center gap-3">
                    <Link2Off className="h-5 w-5 text-sidebar-foreground/70" />
                    <span className="text-sidebar-foreground/90">Without Links</span>
                </div>
                <span className="font-mono font-semibold text-lg">{artistsWithoutLinks}</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
