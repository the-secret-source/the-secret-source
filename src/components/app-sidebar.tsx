import { artists } from "@/data/artists";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Music, Users } from "lucide-react";

export function AppSidebar() {
  const artistCount = artists.length;
  const trackCount = artists.reduce((sum, artist) => sum + artist.tracks.length, 0);

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
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
