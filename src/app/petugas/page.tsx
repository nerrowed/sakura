import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, ArrowRight } from "lucide-react"

const todayPickups = [
  { 
    id: 1, 
    customer: "Siti Saleha", 
    avatar: "https://placehold.co/100x100.png", 
    initial: "SS", 
    address: "Jl. Melati No. 12, Jakarta", 
    time: "10:00 - 11:00", 
    status: "Menunggu" 
  },
  { 
    id: 2, 
    customer: "Ahmad Dahlan", 
    avatar: "https://placehold.co/100x100.png", 
    initial: "AD", 
    address: "Jl. Anggrek No. 8, Jakarta", 
    time: "11:00 - 12:00", 
    status: "Menunggu" 
  },
  { 
    id: 3, 
    customer: "Rina Pertiwi", 
    avatar: "https://placehold.co/100x100.png", 
    initial: "RP", 
    address: "Komp. Mawar Asri Blok C2, Jakarta", 
    time: "13:00 - 14:00", 
    status: "Selesai" 
  },
];


export default function PetugasDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Jadwal Penjemputan Hari Ini</h1>
        <p className="text-muted-foreground">Berikut adalah daftar tugas penjemputan untuk Anda.</p>
      </header>

      <div className="grid gap-6">
        {todayPickups.map((pickup) => (
          <Card key={pickup.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
                <CardHeader className="flex-1 p-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={pickup.avatar} data-ai-hint="profile picture" />
                            <AvatarFallback>{pickup.initial}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{pickup.customer}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span>{pickup.address}</span>
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{pickup.time}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardFooter className="flex items-center justify-end bg-secondary/50 p-6 sm:w-auto">
                    {pickup.status === 'Menunggu' ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Input Hasil <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Input Hasil Penjemputan</DialogTitle>
                                    <DialogDescription>
                                        Masukkan detail sampah yang dijemput dari {pickup.customer}.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Jenis Sampah</label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Pilih jenis sampah" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="plastik">Plastik</SelectItem>
                                                <SelectItem value="kertas">Kertas</SelectItem>
                                                <SelectItem value="kaca">Kaca</SelectItem>
                                                <SelectItem value="logam">Logam</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Berat (kg)</label>
                                        <Input type="number" placeholder="Contoh: 5.5" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Batal</Button>
                                    </DialogClose>
                                    <Button>Simpan</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ) : (
                         <Badge variant="default">Selesai</Badge>
                    )}
                </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
