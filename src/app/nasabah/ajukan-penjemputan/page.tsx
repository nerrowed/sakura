'use client';

import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, SendIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AjukanPenjemputanPage() {
  const [wasteType, setWasteType] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const wasteTypes = ['Plastik', 'Kertas', 'Logam', 'Kaca', 'Organik', 'Elektronik', 'Lainnya'];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast({
        title: 'Error',
        description: 'Anda harus login untuk mengajukan penjemputan.',
        variant: 'destructive',
      });
      return;
    }

    if (!wasteType || !date || !time || !location) {
      toast({
        title: 'Error',
        description: 'Harap lengkapi semua field.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const dateTimeString = `${format(date, 'yyyy-MM-dd')}T${time}:00`;
      const pickupDateTime = Timestamp.fromDate(new Date(dateTimeString));

      await addDoc(collection(db, 'pickups'), {
        userId: user.uid,
        type: wasteType,
        date: pickupDateTime,
        location,
        status: 'Diajukan',
        createdAt: Timestamp.now(),
      });

      toast({
        title: 'Sukses',
        description: 'Pengajuan penjemputan berhasil dikirim.',
      });

      // Clear form
      setWasteType('');
      setDate(new Date());
      setTime('');
      setLocation('');

      router.push('/nasabah'); // Redirect to dashboard after submission

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat mengajukan penjemputan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Ajukan Penjemputan</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Form Pengajuan Penjemputan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="wasteType">Jenis Sampah</Label>
              <Select onValueChange={setWasteType} value={wasteType}>
                <SelectTrigger id="wasteType">
                  <SelectValue placeholder="Pilih jenis sampah" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Tanggal Penjemputan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time">Waktu Penjemputan</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Textarea
                id="location"
                placeholder="Masukkan alamat lengkap"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <SendIcon className="mr-2 h-4 w-4 animate-pulse" /> Mengirim...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" /> Kirim
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
