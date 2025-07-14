'use client';

import Link from 'next/link';
import { Flower2, LogOut, Menu, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/nasabah', label: 'Beranda' },
    { href: '/nasabah/ajukan-penjemputan', label: 'Ajukan Penjemputan' },
    { href: '#', label: 'Riwayat Penjemputan' }, // Placeholder link
    { href: '#', label: 'Profil' }, // Placeholder link
];

export default function NasabahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
     if (!loading) {
      if (!user || role !== 'nasabah') {
        router.push('/');
      }
    }
  }, [loading, user, role, router]);

  if (loading || !user || role !== 'nasabah') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Memverifikasi akses nasabah...</p>
          </div>
       </div>
    );
  }
  
  const handleSignOut = async () => {
    await signOut();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/nasabah"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Flower2 className="h-6 w-6 text-primary" />
            <span className="font-headline tracking-wider">BANK SAMPAH SAKURA</span>
          </Link>
          {navLinks.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                className={cn("transition-colors hover:text-foreground", pathname === link.href ? "text-foreground" : "text-muted-foreground")}
            >
                {link.label}
            </Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/nasabah"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Flower2 className="h-6 w-6 text-primary" />
                <span className="font-headline tracking-wider">BANK SAMPAH SAKURA</span>
              </Link>
              {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn("hover:text-foreground", pathname === link.href ? "text-foreground" : "text-muted-foreground")}
                >
                    {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p>Akun Saya</p>
                <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}