'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Recycle, Users, DollarSign } from 'lucide-react';

const stats = [
  { title: 'Total Sampah Terkumpul (Bulan Ini)', value: '1,250 kg', icon: Recycle },
  { title: 'Jumlah Transaksi', value: '342', icon: BarChart3 },
  { title: 'Nasabah Aktif', value: '128', icon: Users },
  { title: 'Total Tabungan Nasabah', value: 'Rp 4,350,000', icon: DollarSign },
];

const weeklyData = [
  { name: 'Senin', volume: 150 },
  { name: 'Selasa', volume: 200 },
  { name: 'Rabu', volume: 180 },
  { name: 'Kamis', volume: 220 },
  { name: 'Jumat', volume: 250 },
  { name: 'Sabtu', volume: 300 },
  { name: 'Minggu', volume: 120 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Dashboard Admin</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas sistem SakuraGo.</p>
      </header>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
          <CardTitle>Volume Sampah Mingguan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="kg" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
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
