'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Loader2, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Flower2 } from 'lucide-react';

export default function PetugasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || role !== 'petugas') {
        router.push('/');
      }
    }
  }, [loading, user, role, router]);

  if (loading || !user || role !== 'petugas') {
    return (
       <div className="flex h-screen w-full items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Memverifikasi akses petugas...</p>
          </div>
       </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Link href="/petugas" className="hidden items-center gap-2 font-semibold text-lg md:flex">
                <Flower2 className="h-6 w-6 text-primary" />
                <span className="font-headline tracking-wider">BANK SAMPAH SAKURA</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UserCircle className="h-5 w-5" />
                <span>{user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
