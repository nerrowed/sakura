'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { CalendarIcon, SendIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { requestPickup } from '@/ai/flows/request-pickup-flow';
import type { RequestPickupInput } from '@/ai/flows/request-pickup-flow';

const formSchema = z.object({
  wasteType: z.string().min(1, 'Jenis sampah harus dipilih.'),
  date: z.date({ required_error: 'Tanggal penjemputan harus diisi.' }),
  time: z.string().min(1, 'Waktu penjemputan harus diisi.'),
  location: z.string().min(10, 'Lokasi harus diisi dengan alamat lengkap.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AjukanPenjemputanPage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wasteType: '',
      date: new Date(),
      time: '',
      location: '',
    },
  });

  const wasteTypes = ['Plastik', 'Kertas', 'Logam', 'Kaca', 'Organik', 'Elektronik', 'Lainnya'];

  const handleSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Anda harus login untuk mengajukan penjemputan.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const dateTimeString = `${format(data.date, 'yyyy-MM-dd')}T${data.time}:00`;
      const pickupDateTime = new Date(dateTimeString);
      
      const pickupData: RequestPickupInput = {
          userId: user.uid,
          userEmail: user.email || 'Tidak diketahui',
          wasteType: data.wasteType,
          pickupTimestamp: pickupDateTime.toISOString(),
          location: data.location
      };

      await requestPickup(pickupData);

      toast({
        title: 'Sukses',
        description: 'Pengajuan penjemputan berhasil dikirim dan notifikasi telah dikirim ke petugas.',
      });

      form.reset();
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="wasteType">Jenis Sampah</Label>
               <Controller
                name="wasteType"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="wasteType">
                      <SelectValue placeholder="Pilih jenis sampah" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.wasteType && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.wasteType.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Tanggal Penjemputan</Label>
                <Controller
                  name="date"
                  control={form.control}
                  render={({ field }) => (
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {form.formState.errors.date && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.date.message}</p>}
              </div>
              <div>
                <Label htmlFor="time">Waktu Penjemputan</Label>
                <Input
                  id="time"
                  type="time"
                  {...form.register('time')}
                />
                {form.formState.errors.time && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.time.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Textarea
                id="location"
                placeholder="Masukkan alamat lengkap"
                {...form.register('location')}
              />
              {form.formState.errors.location && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.location.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...
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
