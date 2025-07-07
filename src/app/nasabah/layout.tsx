'use client';

import Link from 'next/link';
import { Flower2, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function NasabahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();

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
    // The signOut function in useAuth now handles the redirect
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
        <Link href="/nasabah" className="flex items-center gap-2 font-semibold text-lg">
          <Flower2 className="h-6 w-6 text-primary" />
          <span className="font-headline tracking-wider">BANK SAMPAH SAKURA</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/nasabah" className="text-foreground transition-colors hover:text-foreground/80 font-semibold">Beranda</Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">Ajukan Penjemputan</Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">Riwayat Penjemputan</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UserCircle className="h-5 w-5" />
            <span>{user.email}</span>
          </div>
           <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4"/>
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
