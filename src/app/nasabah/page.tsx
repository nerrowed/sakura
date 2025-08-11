'use client';

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Pickup } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, HelpCircle, ClipboardList, Loader2, AlertTriangle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

function getStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
    switch (status) {
        case 'Selesai': return 'default';
        case 'Diproses': return 'secondary';
        case 'Diajukan': return 'outline';
        default: return 'secondary';
    }
}

export default function NasabahDashboardPage() {
  const [pickupHistory, setPickupHistory] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    setLoading(true);
    setError(null);
    const pickupQuery = query(
      collection(db, "pickups"), 
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(pickupQuery, (querySnapshot) => {
      const history: Pickup[] = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() } as Pickup);
      });
      
      setPickupHistory(history);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching pickup history: ", err);
      setError("Gagal memuat riwayat transaksi. Error ini biasanya memerlukan pembuatan indeks di Firestore. Silakan periksa konsol browser untuk link pembuatan indeks otomatis.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);
  
  const totalPoints = pickupHistory.reduce((acc, item) => acc + (item.points || 0), 0);
  const userDisplayName = user?.email?.split('@')[0] || 'Nasabah';
  const upcomingPickup = pickupHistory.find(p => p.status === 'Diajukan' || p.status === 'Diproses');


  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data Anda...</p>
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
    <div className="flex flex-col gap-6">
      <header>
            <h1 className="text-3xl font-bold font-headline capitalize">Selamat datang, {userDisplayName}!</h1>
            <p className="text-muted-foreground">Ini ringkasan aktivitas bank sampah Anda.</p>
        </header>
      
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardDescription>Total Poin Tabungan</CardDescription>
                    <CardTitle className="text-4xl">{new Intl.NumberFormat('id-ID').format(totalPoints)}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Jadwal Penjemputan Berikutnya</CardDescription>
                    <CardTitle className="text-2xl md:text-3xl">
                        {upcomingPickup ? 
                        new Date(upcomingPickup.date.toDate()).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
                        : 'Belum ada jadwal'}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
      
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Riwayat Transaksi Terbaru</CardTitle>
              <CardDescription>Menampilkan 3 transaksi terakhir Anda.</CardDescription>
            </div>
            <Button onClick={() => router.push('/nasabah/ajukan-penjemputan')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajukan Penjemputan
            </Button>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Jenis Sampah</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {pickupHistory.length > 0 ? pickupHistory.slice(0, 3).map((item) => (
                          <TableRow key={item.id} onClick={() => router.push('/nasabah/riwayat-penjemputan')} className="cursor-pointer">
                              <TableCell>{item.date ? new Date(item.date.toDate()).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</TableCell>
                              <TableCell>{item.type}</TableCell>
                              <TableCell className="text-right"><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                              <TableCell colSpan={3} className="text-center h-24">Belum ada riwayat transaksi.</TableCell>
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
               {pickupHistory.length > 3 && (
                  <div className="text-center mt-4">
                    <Button variant="link" onClick={() => router.push('/nasabah/riwayat-penjemputan')}>
                      Lihat Semua Riwayat
                    </Button>
                  </div>
                )}
          </CardContent>
        </Card>

    </div>
  );
}
