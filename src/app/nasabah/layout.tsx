import Link from 'next/link';
import { Flower2, UserCircle } from 'lucide-react';

export default function NasabahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Link href="#" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <UserCircle className="h-5 w-5" />
          <span>Profil</span>
        </Link>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
