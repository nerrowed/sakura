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
  Bot,
  User,
  LogOut,
  Leaf,
  DollarSign,
  BellRing,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSidebar } from '@/hooks/use-sidebar';

const commonLinks = [
  { href: '/notifikasi', label: 'Notifikasi', icon: BellRing },
];

const nasabahLinks = [
  { href: '/nasabah', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/nasabah/request', label: 'Ajukan Penjemputan', icon: Truck },
  { href: '/nasabah/history', label: 'Histori', icon: History },
  { href: '/nasabah/savings', label: 'Tabungan', icon: DollarSign },
];

const petugasLinks = [
  { href: '/petugas', label: 'Jadwal Hari Ini', icon: LayoutDashboard },
  { href: '/petugas/history', label: 'Riwayat Penjemputan', icon: History },
];

const adminLinks = [
  { href: '/admin', label: 'Statistik', icon: BarChart3 },
  { href: '/admin/users', label: 'Kelola Pengguna', icon: Users },
  { href: '/admin/schedules', label: 'Kelola Jadwal', icon: Truck },
  { href: '/admin/notifications', label: 'Generator Notifikasi', icon: Bot },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  let role = 'User';
  let links = commonLinks;
  let user = { name: 'User', avatar: '', initial: 'U' };

  if (pathname.startsWith('/nasabah')) {
    role = 'Nasabah';
    links = [...nasabahLinks, ...commonLinks];
    user = { name: 'Siti Saleha', avatar: 'https://placehold.co/100x100.png', initial: 'SS' };
  } else if (pathname.startsWith('/petugas')) {
    role = 'Petugas';
    links = [...petugasLinks, ...commonLinks];
    user = { name: 'Budi Santoso', avatar: 'https://placehold.co/100x100.png', initial: 'BS' };
  } else if (pathname.startsWith('/admin')) {
    role = 'Admin';
    links = [...adminLinks, ...commonLinks];
    user = { name: 'Admin Utama', avatar: 'https://placehold.co/100x100.png', initial: 'AU' };
  }

  const isActive = (href: string) => {
    // Exact match for main dashboard pages, partial for subpages
    if (href === '/nasabah' || href === '/petugas' || href === '/admin') {
      return pathname === href;
    }
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
            <AvatarImage src={user.avatar} data-ai-hint="profile picture" />
            <AvatarFallback>{user.initial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
             <span className="font-semibold text-sm truncate">{user.name}</span>
             <span className="text-xs text-muted-foreground">{role}</span>
          </div>
        </div>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip={{children: 'Logout'}}>
                    <Link href="/">
                        <LogOut />
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
