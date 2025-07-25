
'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Recycle, Users, DollarSign, Loader2, UserCog, AlertTriangle, Calendar as CalendarIcon, Filter } from 'lucide-react';
import type { Pickup } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

interface Stats {
  totalWaste: number;
  totalTransactions: number;
  activeCustomers: number;
  activeOfficers: number;
  totalSavings: number;
}

interface DailyData {
  name: string;
  volume: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalWaste: 0,
    totalTransactions: 0,
    activeCustomers: 0,
    activeOfficers: 0,
    totalSavings: 0,
  });
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return { from: start, to: end };
  });

  const fetchAndProcessData = useCallback((currentDateRange: DateRange | undefined) => {
    setLoading(true);
    setError(null);
    
    // Unsubscribe functions array
    const unsubscribes: (() => void)[] = [];

    // User stats are not date-dependent in this logic
    const usersQuery = query(collection(db, "users"));
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
      setError("Gagal memuat data pengguna.");
    });
    unsubscribes.push(unsubscribeUsers);


    // Pickups query depends on date range
    if (!currentDateRange?.from || !currentDateRange?.to) {
      setError("Rentang tanggal tidak valid.");
      setLoading(false);
      return () => unsubscribes.forEach(unsub => unsub());
    }
    
    const startTimestamp = Timestamp.fromDate(currentDateRange.from);
    const endOfDay = new Date(currentDateRange.to);
    endOfDay.setHours(23, 59, 59, 999);
    const endTimestamp = Timestamp.fromDate(endOfDay);
    
    const pickupsQuery = query(
        collection(db, "pickups"), 
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp)
    );

    const unsubscribePickups = onSnapshot(pickupsQuery, (querySnapshot) => {
      const pickups: Pickup[] = [];
      querySnapshot.forEach(doc => {
        pickups.push({ id: doc.id, ...doc.data() } as Pickup);
      });

      const totalWaste = pickups.reduce((sum, p) => sum + (parseFloat(p.weight || '0') || 0), 0);
      const totalSavings = pickups.reduce((sum, p) => sum + (p.points || 0), 0);

      // Process data for chart based on date range
      const dailyVolumes = new Map<string, number>();
      let currentDate = new Date(currentDateRange.from as Date);
      while (currentDate <= (currentDateRange.to as Date)) {
          dailyVolumes.set(format(currentDate, 'dd/MM/yy'), 0);
          currentDate = addDays(currentDate, 1);
      }

      pickups.forEach(p => {
        if (!p.date) return;
        const dayName = format(new Date(p.date.toDate()), 'dd/MM/yy');
        if (dailyVolumes.has(dayName)) {
            dailyVolumes.set(dayName, dailyVolumes.get(dayName)! + (parseFloat(p.weight || '0') || 0));
        }
      });
      
      const sortedDailyData = Array.from(dailyVolumes.entries()).map(([name, volume]) => ({
          name: name.substring(0, 5), // 'dd/MM'
          volume: Math.round(volume * 10) / 10,
          date: new Date(`20${name.substring(6,8)}-${name.substring(3,5)}-${name.substring(0,2)}`)
      })).sort((a,b) => a.date.getTime() - b.date.getTime());

      setDailyData(sortedDailyData);
      
      setStats(prevStats => ({
        ...prevStats,
        totalWaste,
        totalTransactions: pickups.length,
        totalSavings,
      }));
      
      setLoading(false);
    }, (err) => {
      console.error("Error fetching pickups: ", err);
      setError("Gagal memuat data penjemputan. Pastikan indeks yang diperlukan telah dibuat di Firestore. (date & status)");
      setLoading(false);
    });
    unsubscribes.push(unsubscribePickups);

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  // Fetch data on initial mount
  useEffect(() => {
    const unsubscribe = fetchAndProcessData(dateRange);
    return () => unsubscribe();
  }, []);

  const handleFilterClick = () => {
     const unsubscribe = fetchAndProcessData(dateRange);
     // In this setup, we don't need to return the unsubscribe function
     // as it will be handled by onSnapshot's lifecycle.
     // For a single getDocs call, you wouldn't need to unsubscribe.
  };


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
    { title: 'Total Sampah', value: `${stats.totalWaste.toFixed(1)} kg`, icon: Recycle },
    { title: 'Jumlah Transaksi', value: stats.totalTransactions, icon: BarChart3 },
    { title: 'Total Tabungan', value: `Rp ${new Intl.NumberFormat('id-ID').format(stats.totalSavings)}`, icon: DollarSign },
    { title: 'Nasabah Aktif', value: stats.activeCustomers, icon: Users },
    { title: 'Petugas Aktif', value: stats.activeOfficers, icon: UserCog },
  ];
  
  const filterLabel = dateRange?.from && dateRange?.to
        ? `${format(dateRange.from, "d LLL, y", { locale: id })} - ${format(dateRange.to, "d LLL, y", { locale: id })}`
        : "Pilih rentang tanggal";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Dashboard Admin</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas sistem SakuraGo secara real-time.</p>
      </header>
      
      <Card>
        <CardHeader>
           <div className="flex flex-wrap items-center justify-between gap-4">
               <CardTitle>Filter Data</CardTitle>
               <div className="flex flex-wrap items-center gap-2">
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className="w-[300px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{filterLabel}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={handleFilterClick} disabled={loading}>
                    <Filter className="mr-2 h-4 w-4" />
                    Terapkan Filter
                  </Button>
               </div>
           </div>
        </CardHeader>
      </Card>
      
      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Memuat data sesuai filter...</p>
            </div>
        </div>
      ) : (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.title.includes('Aktif') ? 'Total pengguna terdaftar' : 'dalam rentang waktu yang dipilih'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Volume Sampah</CardTitle>
             <CardDescription>Berdasarkan rentang tanggal: {filterLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
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
      </>
      )}
    </div>
  );
}
