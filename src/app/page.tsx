import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-4xl font-bold text-primary">SakuraGo</CardTitle>
            <CardDescription className="pt-1">Sistem Digitalisasi Penjemputan Sampah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <div className="text-center text-sm text-muted-foreground">Masuk sebagai:</div>
            <div className="grid grid-cols-1 gap-3">
              <Button asChild size="lg" className="font-bold">
                <Link href="/nasabah">Nasabah</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="font-bold">
                <Link href="/petugas">Petugas</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold">
                <Link href="/admin">Admin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SakuraGo. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
