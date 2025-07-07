
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Recycle, Users, DollarSign, Loader2, UserCog, AlertTriangle } from 'lucide-react';
import type { Pickup } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Stats {
  totalWasteThisMonth: number;
  totalTransactions: number;
  activeCustomers: number;
  activeOfficers: number;
  totalSavings: number;
}

interface WeeklyData {
  name: string;
  volume: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalWasteThisMonth: 0,
    totalTransactions: 0,
    activeCustomers: 0,
    activeOfficers: 0,
    totalSavings: 0,
  });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usersQuery = query(collection(db, "users"));
    const pickupsQuery = query(collection(db, "pickups"));
    
    const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
      let customers = 0;
      let officers = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data().role === 'nasabah') customers++;
        if (doc.data().role === 'petugas') officers++;
      });
      setStats(prevStats => ({
        ...prevStats,
        activeCustomers: customers,
        activeOfficers: officers,
      }));
    }, (err) => {
      console.error("Error fetching users: ", err);
      setError("Gagal memuat data pengguna. Pastikan Anda memiliki izin yang benar untuk mengakses koleksi 'users'.");
      setLoading(false);
    });

    const unsubscribePickups = onSnapshot(pickupsQuery, (querySnapshot) => {
      const pickups: Pickup[] = [];
      querySnapshot.forEach(doc => {
        pickups.push({ id: doc.id, ...doc.data() } as Pickup);
      });

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const totalWasteThisMonth = pickups
        .filter(p => new Date(p.date) >= startOfMonth)
        .reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0);

      const totalSavings = pickups.reduce((sum, p) => sum + (p.points || 0), 0);
      
      const last7Days = Array(7).fill(0).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d;
      }).reverse();

      const dailyVolumes = new Map<string, number>();
      const dayNames = last7Days.map(day => day.toLocaleDateString('id-ID', { weekday: 'short' }));
      dayNames.forEach(name => dailyVolumes.set(name, 0));

      pickups
        .filter(p => {
            const pickupDate = new Date(p.date);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return pickupDate >= sevenDaysAgo;
        })
        .forEach(p => {
            const dayName = new Date(p.date).toLocaleDateString('id-ID', { weekday: 'short' });
            if (dailyVolumes.has(dayName)) {
                dailyVolumes.set(dayName, dailyVolumes.get(dayName)! + (parseFloat(p.weight) || 0));
            }
        });
      
      const formattedWeeklyData = Array.from(dailyVolumes.entries()).map(([name, volume]) => ({
          name,
          volume: Math.round(volume * 10) / 10
      }));

      setWeeklyData(formattedWeeklyData);

      setStats(prevStats => ({
        ...prevStats,
        totalWasteThisMonth,
        totalTransactions: pickups.length,
        totalSavings,
      }));
      
      setLoading(false);

    }, (err) => {
      console.error("Error fetching pickups: ", err);
      setError("Gagal memuat data penjemputan. Jika ini adalah query gabungan, Anda mungkin perlu membuat indeks di Firestore. Periksa konsol untuk link pembuatan indeks.");
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePickups();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data real-time...</p>
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

  const statCards = [
    { title: 'Total Sampah (Bulan Ini)', value: `${stats.totalWasteThisMonth.toFixed(1)} kg`, icon: Recycle },
    { title: 'Jumlah Transaksi', value: stats.totalTransactions, icon: BarChart3 },
    { title: 'Nasabah Aktif', value: stats.activeCustomers, icon: Users },
    { title: 'Petugas Aktif', value: stats.activeOfficers, icon: UserCog },
    { title: 'Total Tabungan Nasabah', value: `Rp ${new Intl.NumberFormat('id-ID').format(stats.totalSavings)}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Dashboard Admin</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas sistem SakuraGo secara real-time.</p>
      </header>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Volume Sampah (7 Hari Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="kg" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                  formatter={(value: number) => `${value.toFixed(1)} kg`}
                />
                <Legend />
                <Bar dataKey="volume" name="Volume Sampah (kg)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
