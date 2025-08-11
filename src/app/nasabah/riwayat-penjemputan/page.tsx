
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { Pickup } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Package, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'Selesai': return 'default';
    case 'Diproses': return 'secondary';
    case 'Diajukan': return 'outline';
    default: return 'secondary';
  }
}

export default function RiwayatPenjemputanPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const pickupQuery = query(
      collection(db, 'pickups'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(pickupQuery, (querySnapshot) => {
      const history: Pickup[] = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() } as Pickup);
      });
      setPickups(history);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching pickup history: ", err);
      setError("Gagal memuat riwayat penjemputan. Pastikan indeks Firestore telah dibuat.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat riwayat Anda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Terjadi Kesalahan</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Riwayat Penjemputan</h1>
        <p className="text-muted-foreground">Berikut adalah semua riwayat penjemputan sampah Anda.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>Total {pickups.length} transaksi tercatat.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis Sampah</TableHead>
                <TableHead>Berat (kg)</TableHead>
                <TableHead>Poin</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickups.length > 0 ? (
                pickups.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>
                      {pickup.date ? new Date(pickup.date.toDate()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric'}) : 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">{pickup.type}</TableCell>
                    <TableCell>{pickup.weight || '-'}</TableCell>
                    <TableCell>{pickup.points ? new Intl.NumberFormat('id-ID').format(pickup.points) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusVariant(pickup.status)} className="capitalize">
                        {pickup.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package className="h-8 w-8" />
                        <span>Anda belum memiliki riwayat penjemputan.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
