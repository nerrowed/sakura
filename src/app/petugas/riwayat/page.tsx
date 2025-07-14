
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, History, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Pickup } from '@/types';

interface PickupWithUser extends Pickup {
  userName: string;
}

export default function RiwayatTugasPage() {
  const [pickups, setPickups] = useState<PickupWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Query for pickups that are 'Selesai' (Completed)
    const pickupsQuery = query(
        collection(db, "pickups"), 
        where("status", "==", "Selesai"),
        orderBy("date", "desc")
    );
    
    const unsubscribe = onSnapshot(pickupsQuery, async (pickupSnapshot) => {
      setLoading(true);
      if (pickupSnapshot.empty) {
        setPickups([]);
        setLoading(false);
        return;
      }

      const pickupData = pickupSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pickup));
      const userIds = [...new Set(pickupData.map(p => p.userId))].filter(id => id);

      if (userIds.length === 0) {
        const pickupsWithNoUser: PickupWithUser[] = pickupData.map(p => ({ ...p, userName: 'Pengguna tidak diketahui' }));
        setPickups(pickupsWithNoUser);
        setLoading(false);
        return;
      }

      try {
        const usersSnapshot = await getDocs(query(collection(db, "users"), where("__name__", "in", userIds)));
        const usersMap = new Map();
        usersSnapshot.forEach(doc => {
          usersMap.set(doc.id, doc.data());
        });

        const pickupsWithUserInfo: PickupWithUser[] = pickupData.map(p => {
          const user = usersMap.get(p.userId);
          const userName = user?.email || 'Pengguna tidak diketahui';
          return {
            ...p,
            userName: userName,
          };
        });

        setPickups(pickupsWithUserInfo);
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        setError("Gagal memuat data detail pengguna untuk riwayat penjemputan.");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error("Error fetching completed pickups: ", err);
      setError("Gagal memuat data riwayat. Pastikan indeks yang diperlukan telah dibuat di Firestore.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat riwayat tugas...</p>
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
     )
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Riwayat Tugas Penjemputan</h1>
        <p className="text-muted-foreground">Daftar semua penjemputan yang telah Anda selesaikan.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Selesai</CardTitle>
          <CardDescription>Total {pickups.length} transaksi selesai tercatat.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead>Nasabah</TableHead>
                <TableHead>Jenis Sampah</TableHead>
                <TableHead>Berat (kg)</TableHead>
                <TableHead>Poin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickups.length > 0 ? (
                pickups.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>{pickup.date ? new Date(pickup.date.toDate()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric'}) : 'N/A'}</TableCell>
                    <TableCell className="font-medium">{pickup.userName}</TableCell>
                    <TableCell>{pickup.type}</TableCell>
                    <TableCell>{pickup.weight || '-'}</TableCell>
                    <TableCell>{pickup.points || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-8 w-8" />
                      <span>Belum ada riwayat tugas yang selesai.</span>
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
