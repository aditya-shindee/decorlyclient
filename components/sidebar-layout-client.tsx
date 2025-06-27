'use client';

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function SidebarLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const hideSidebarPaths = ['/', '/sign-in', '/sign-up', '/verify-signup-link'];
  const showSidebar = !hideSidebarPaths.includes(pathname);

  return (
    <div className="flex min-h-screen w-full">
      {showSidebar && <AppSidebar />}
      <main className={`flex-1 w-full ${showSidebar ? 'flex flex-col' : 'flex flex-col'} relative`}>
        {showSidebar && (
          <SidebarTrigger 
            className={`
              z-50
              ${isMobile ? 'fixed top-4 left-4' : 'absolute top-6 left-6'}
              ${!isMobile && state !== 'collapsed' ? 'hidden' : ''}
            `}
          />
        )}
        {children}
      </main>
    </div>
  );
}

export default function SidebarLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarLayoutContent>{children}</SidebarLayoutContent>
    </SidebarProvider>
  );
}
