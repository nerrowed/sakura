'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, DollarSign, Gift, Recycle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const pickupHistory = [
  { id: "TRX001", date: "2024-05-20", type: "Plastik", weight: "5 kg", points: "Rp 12,500", status: "Selesai" },
  { id: "TRX002", date: "2024-05-22", type: "Kertas", weight: "3 kg", points: "Rp 4,500", status: "Selesai" },
  { id: "TRX003", date: "2024-05-25", type: "Botol Kaca", weight: "7 kg", points: "Rp 10,500", status: "Selesai" },
  { id: "TRX004", date: "2024-05-28", type: "Lainnya", weight: "2 kg", points: "Rp 2,000", status: "Selesai" },
  { id: "TRX005", date: "2024-06-01", type: "Plastik", weight: "4 kg", points: "Rp 10,000", status: "Diproses" },
];

const savingsData = [
    { month: 'Jan', earnings: 25000 },
    { month: 'Feb', earnings: 32000 },
    { month: 'Mar', earnings: 45000 },
    { month: 'Apr', earnings: 38000 },
    { month: 'Mei', earnings: 51000 },
];

function getStatusVariant(status: string): "default" | "secondary" | "outline" {
    switch (status) {
        case 'Selesai': return 'default';
        case 'Diproses': return 'secondary';
        case 'Diajukan': return 'outline';
        default: return 'secondary';
    }
}


export default function NasabahDashboardPage() {
  return (
    <div className="space-y-8">
        <header>
            <h1 className="text-3xl font-bold font-headline">Selamat Datang, Siti!</h1>
            <p className="text-muted-foreground">Kelola penjemputan sampah dan pantau tabunganmu di sini.</p>
        </header>

        <Tabs defaultValue="request">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="request">Ajukan Penjemputan</TabsTrigger>
                <TabsTrigger value="status">Status & Histori</TabsTrigger>
                <TabsTrigger value="savings">Tabungan Saya</TabsTrigger>
            </TabsList>

            <TabsContent value="request">
                <Card>
                    <CardHeader>
                        <CardTitle>Form Pengajuan Penjemputan</CardTitle>
                        <CardDescription>Isi detail di bawah untuk menjadwalkan penjemputan sampah.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Alamat Penjemputan</label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Pilih alamat Anda" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rumah">Rumah - Jl. Melati No. 12, Jakarta</SelectItem>
                                    <SelectItem value="kantor">Kantor - Jl. Mawar No. 34, Jakarta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Jenis Sampah</label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Pilih jenis sampah" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plastik">Plastik (Botol, Gelas, dll)</SelectItem>
                                    <SelectItem value="kertas">Kertas & Kardus</SelectItem>
                                    <SelectItem value="kaca">Botol Kaca</SelectItem>
                                    <SelectItem value="logam">Logam (Kaleng, dll)</SelectItem>
                                    <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tanggal Penjemputan</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span>Pilih tanggal</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Ajukan Penjemputan</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="status">
                <Card>
                    <CardHeader>
                        <CardTitle>Status Penjemputan & Histori</CardTitle>
                        <CardDescription>Lacak status penjemputan Anda dan lihat riwayat transaksi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Transaksi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Jenis Sampah</TableHead>
                                    <TableHead>Berat</TableHead>
                                    <TableHead>Poin/Saldo</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pickupHistory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.weight}</TableCell>
                                        <TableCell>{item.points}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="savings">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="lg:col-span-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Grafik Tabungan</CardTitle>
                                <CardDescription>Perkembangan tabungan Anda selama 5 bulan terakhir.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] w-full">
                                <ResponsiveContainer>
                                    <BarChart data={savingsData}>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${Number(value)/1000}k`}/>
                                        <Tooltip cursor={{fill: 'hsl(var(--accent))', opacity: '0.3'}} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: 'none', borderRadius: '0.5rem' }}/>
                                        <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="lg:col-span-2 space-y-4">
                        <Card className="bg-primary text-primary-foreground">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-primary-foreground/80">Total Tabungan</CardDescription>
                                <CardTitle className="text-4xl">Rp 189,500</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-primary-foreground/80">+Rp 51,000 dari bulan lalu</div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Poin</CardTitle>
                                <Gift className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,895</div>
                                <p className="text-xs text-muted-foreground">Tukarkan dengan hadiah menarik!</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
