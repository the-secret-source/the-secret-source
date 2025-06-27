import { AppSidebar } from '@/components/app-sidebar';
import { HomePage } from '@/components/home-page';
import { SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <HomePage />
      </SidebarInset>
    </>
  );
}
