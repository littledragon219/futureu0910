"use client";

import { SidebarNavigation } from '@/components/sidebar-navigation';
import BottomNavigation from '@/components/bottom-navigation';
import { cn } from '@/lib/utils';
import type { User } from "@supabase/supabase-js";
import { useMediaQuery } from '@/hooks/use-media-query';
import { useInterfaceStore } from '@/lib/store/useInterfaceStore';

interface AppShellProps {
  user: User | null;
  children: React.ReactNode;
}

export default function AppShell({ user, children }: AppShellProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { isSidebarCollapsed } = useInterfaceStore();

  return (
    <div className="flex min-h-screen">
      {isDesktop && (
        <SidebarNavigation />
      )}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isDesktop ? (isSidebarCollapsed ? "ml-20" : "ml-56") : "pb-16"
      )}>
        <div className="w-full">
          {children}
        </div>
      </main>
      {!isDesktop && <BottomNavigation user={user} />}
    </div>
  );
}