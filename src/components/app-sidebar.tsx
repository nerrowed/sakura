'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Truck,
  History,
  Users,
  BarChart3,
  LogOut,
  Leaf,
  BellRing,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';

const petugasLinks = [
  { href: '/petugas', label: 'Jadwal Penjemputan', icon: LayoutDashboard },
];

const adminLinks = [
  { href: '/admin', label: 'Statistik', icon: BarChart3 },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
  { href: '/admin/pickups', label: 'Monitoring Penjemputan', icon: ClipboardList },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut, role } = useAuth();
  
  let links: { href: string; label: string; icon: React.ElementType }[] = [];
  let userName = user?.email?.split('@')[0] || 'User';
  let userInitial = userName.charAt(0).toUpperCase();

  if (role === 'petugas') {
    links = [...petugasLinks];
  } else if (role === 'admin') {
    links = [...adminLinks];
  }

  const isActive = (href: string) => {
    // Exact match for dashboard pages
    if (href === '/petugas' || href === '/admin') {
      return pathname === href;
    }
    // Prefix match for other pages
    return pathname.startsWith(href);
  };
  
  return (
    <>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold text-primary font-headline">SakuraGo</span>
        </div>
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={{children: link.label}}>
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2 rounded-md transition-colors">
          <Avatar>
            <AvatarImage src={'https://placehold.co/100x100.png'} data-ai-hint="profile picture" />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
             <span className="font-semibold text-sm truncate capitalize">{userName}</span>
             <span className="text-xs text-muted-foreground capitalize">{role}</span>
          </div>
        </div>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton onClick={signOut} tooltip={{children: 'Logout'}}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
