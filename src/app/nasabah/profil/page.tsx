'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Mail } from 'lucide-react';

export default function ProfilPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // Atau bisa diganti dengan loading skeleton
  }

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi akun Anda di sini.</p>
      </header>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="profile picture" />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl capitalize">{user.email?.split('@')[0]}</CardTitle>
              <CardDescription>Nasabah Bank Sampah Sakura</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Informasi Akun</h3>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span>{user.email}</span>
            </div>
             <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Peran:</span>
              <span className="capitalize">Nasabah</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled>Ubah Password (Segera Hadir)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
