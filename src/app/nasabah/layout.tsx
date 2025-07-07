'use client';

import Link from 'next/link';
import { Flower2, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function NasabahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push('/');
    }
  }, [auth.loading, auth.user, router]);

  if (auth.loading || !auth.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 text-center">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
       </div>
    );
  }
  
  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
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
            <span>{auth.user.email}</span>
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
