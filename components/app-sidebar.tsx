'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavSecondary } from "@/components/nav-secondary"
import {
  Coins,
  User2,
  ChevronsUpDown,
  LogOut,
  Bell,
  LifeBuoy,
  GalleryVerticalEnd,
  LogIn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getSupabaseUserId } from "@/utils/get-supabase-user";
import { useRealtimeSpaceData } from "@/hooks/useRealtimeSpaceData";
import { useRealtimeCreditData } from "@/hooks/useRealtimeCreditData";

interface Space {
  name: string;
  theme: string;
  url: string;
}

const data = {navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    }
]}

export function AppSidebar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { spaces, isLoading: isLoadingSpaces } = useRealtimeSpaceData(supabaseUserId);
  const { creditData, isLoading: isLoadingCredits } = useRealtimeCreditData(supabaseUserId);
  
  // Debug: Log credit changes in sidebar
  useEffect(() => {
    console.log('Sidebar - Credits updated:', creditData.amount, 'Loading:', isLoadingCredits);
  }, [creditData.amount, isLoadingCredits]);
  
  // Animated credits state
  const prevCredits = useRef<number | null>(null);
  const [displayedCredits, setDisplayedCredits] = useState(creditData.amount);

  useEffect(() => {
    if (isLoadingCredits) return;
    const initialStartValue = prevCredits.current;
    const endValue = creditData.amount;
    const currentStartValue = initialStartValue === null ? endValue : initialStartValue;
    if (currentStartValue === endValue) {
      setDisplayedCredits(endValue);
      prevCredits.current = endValue;
      return;
    }
    const duration = 300; // ms
    let animationStartTime: number | null = null;
    function animateCredits(timestamp: number) {
      if (animationStartTime === null) {
        animationStartTime = timestamp;
      }
      const elapsed = timestamp - animationStartTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(currentStartValue + (endValue - currentStartValue) * progress);
      setDisplayedCredits(value);
      if (progress < 1) {
        requestAnimationFrame(animateCredits);
      } else {
        setDisplayedCredits(endValue);
        prevCredits.current = endValue;
      }
    }
    requestAnimationFrame(animateCredits);
    return () => {
      prevCredits.current = endValue;
    };
  }, [creditData.amount, isLoadingCredits]);

  const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : '';

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn || !user) {
        setAvatarUrl(null);
        return;
      }

      try {
        // Set avatar URL
        setAvatarUrl(user.externalAccounts[0]?.imageUrl || null);
        
        // Get the Supabase user ID
        const userId = await getSupabaseUserId(user.id);
        console.log(userId);
        setSupabaseUserId(userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [isSignedIn, user]);

  const handleSignIn = () => {
    const currentUrl = window.location.href;
    router.push(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Sidebar variant="floating" className="bg-gray-100 rounded-4xl border-gray-200 p-2">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="-ml-1" size="lg" asChild>
                <a href="/studio">
                  <div className="bg-white rounded-lg w-8 h-8 flex items-center justify-center text-white text-xl font-bold -ml-2">
                    <div className="absolute h-4 w-4 border-2 border-[#1A202C] opacity-80"></div>
                    <div className="absolute h-4 w-4 translate-x-1.5 translate-y-1.5 border-2 border-[#8338EC]"></div>
                  </div>
                  <div className="flex flex-col gap-0 leading-none">
                    <span className="ml-2 mt-2 font-poppins text-sm font-bold uppercase tracking-widest text-[#1A202C]">decorly</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger className="ml-2" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Spaces</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {isSignedIn && (isLoadingSpaces || (spaces.length === 0 && isLoadingSpaces !== false)) ? (
                <>
                  <SidebarMenuItem>
                    <div className="flex items-center px-2 py-2 w-full">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <div className="flex items-center px-2 py-2 w-full">
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <div className="flex items-center px-2 py-2 w-full">
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </SidebarMenuItem>
                </>
              ) : spaces.length === 0 ? (
                <SidebarMenuItem>
                  <span className="text-sm font-medium text-gray-900 capitalize tracking-wide ml-2">No spaces found</span>
                </SidebarMenuItem>
              ) : (
                spaces.map((space) => (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={space.url}>
                        <span className="text-sm font-medium text-gray-900 capitalize tracking-wide">
                          {space.name} · {space.theme} ...
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarGroupLabel className="text-sm ml-4">Help</SidebarGroupLabel>
      <NavSecondary items={data.navSecondary} className="mt-auto" />
      {user && (
        <>
          <DropdownMenuSeparator />
          <div className="px-2 py-2">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-2 flex items-center min-w-[120px]">
              <Coins className="w-4 h-4 text-emerald-500 opacity-80 mr-1" />
              <span className="text-sm font-medium text-emerald-700 opacity-80 mr-2">Available Credits:</span>
              {isLoadingCredits ? (
                <Skeleton className="h-5 w-10" />
              ) : (
                <span
                  key={displayedCredits}
                  className="text-base font-semibold text-emerald-700"
                >
                  {displayedCredits.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
        </>
      )}
      <SidebarFooter>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted transition">
                <Avatar className="w-8 h-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={`${initials}`} />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium leading-tight">
                    {capitalize(user.firstName || '')} {capitalize(user.lastName || '')}
                  </div>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-60">
              <div className="flex items-center gap-3 p-3 -ml-2">
                <Avatar className="w-10 h-10">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={`${initials}`} />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <div className="-ml-1">
                  <div className="font-medium">{capitalize(user.firstName || '')} {capitalize(user.lastName || '')}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const currentUrl = window.location.href;
                router.push(`/pricing?ref=${encodeURIComponent(currentUrl)}`);
              }}>
                <Coins className="mr-2 w-4 h-4" /> Buy Credits
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 w-4 h-4" /> Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                signOut({ redirectUrl: '/studio' });
              }}>
                <LogOut className="mr-2 w-4 h-4 text-red-500" />
                <span className="text-red-500">Log out</span> 
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleSignIn()}>
                <LogIn className="ml-1 w-4 h-4" />
                <span className="font-semibold text-sm ml-1">Login</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}