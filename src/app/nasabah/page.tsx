'use client';

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Pickup } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, HelpCircle, ClipboardList } from "lucide-react";
import Link from "next/link";

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
  // Untuk demonstrasi, kita akan menggunakan ID pengguna yang di-hardcode.
  const userId = "user_yunita";

  useEffect(() => {
    if (!userId) return;

    // Listener realtime untuk riwayat penjemputan
    const pickupQuery = query(
      collection(db, "pickups"), 
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const unsubscribePickups = onSnapshot(pickupQuery, (querySnapshot) => {
      const history: Pickup[] = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() } as Pickup);
      });
      setPickupHistory(history);
    });

    return () => unsubscribePickups();
  }, [userId]);
  
  const totalPoints = pickupHistory.reduce((acc, item) => acc + (item.points || 0), 0);

  return (
    <div className="flex flex-col gap-6">
        <header>
            <h1 className="text-3xl font-bold font-headline">Selamat datang, Yunita!</h1>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardDescription>Poin tabungan sampah</CardDescription>
                    <CardTitle className="text-4xl">{new Intl.NumberFormat('id-ID').format(totalPoints)}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Jadwal penjemputan berikutnya</CardDescription>
                    <CardTitle className="text-4xl">21 Mei 2024</CardTitle>
                </CardHeader>
            </Card>
        </div>

        <div className="w-full">
          <Button size="lg" className="w-full md:w-auto">Ajukan Penjemputan</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <Link href="#">
              <Card className="hover:bg-accent/50 transition-colors h-full">
                  <CardHeader>
                      <BarChart3 className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">Ajukan Penjemputan</CardTitle>
                      <CardDescription>Ajukan permintaan penjemputan sampah</CardDescription>
                  </CardHeader>
              </Card>
            </Link>
             <Link href="#">
              <Card className="hover:bg-accent/50 transition-colors h-full">
                  <CardHeader>
                      <HelpCircle className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">Jadwal Penjemputan</CardTitle>
                      <CardDescription>Lihat jadwal penjemputan sampah Anda</CardDescription>
                  </CardHeader>
              </Card>
            </Link>
             <Link href="#">
              <Card className="hover:bg-accent/50 transition-colors h-full">
                  <CardHeader>
                      <ClipboardList className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
                      <CardDescription>Pantau riwayat penjemputan sampah</CardDescription>
                  </CardHeader>
              </Card>
            </Link>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Riwayat Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Jenis Sampah</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pickupHistory.length > 0 ? pickupHistory.slice(0, 3).map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">Belum ada riwayat transaksi.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
