'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs, Timestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Pickup } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, ArrowRight, Loader2, AlertTriangle, PackageCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";

interface PickupWithUser extends Pickup {
  userName: string;
  userInitial: string;
}

export default function PetugasDashboardPage() {
  const [pickups, setPickups] = useState<PickupWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPickup, setSelectedPickup] = useState<PickupWithUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(
      collection(db, "pickups"), 
      where("status", "in", ["Diajukan", "Diproses"])
    );

    const unsubscribe = onSnapshot(q, async (pickupSnapshot) => {
      setLoading(true);
      if (pickupSnapshot.empty) {
        setPickups([]);
        setLoading(false);
        return;
      }

      const pickupData = pickupSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pickup));
      const userIds = [...new Set(pickupData.map(p => p.userId))].filter(id => id);

      if (userIds.length === 0) {
        setPickups([]);
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
          const userName = user?.email?.split('@')[0] || 'Nasabah';
          return {
            ...p,
            userName: userName,
            userInitial: userName.charAt(0).toUpperCase(),
          };
        });

        // Sort client-side to avoid complex query
        pickupsWithUserInfo.sort((a, b) => {
            if (a.date && b.date) {
                return a.date.toMillis() - b.date.toMillis();
            }
            return 0;
        });

        setPickups(pickupsWithUserInfo);
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        setError("Gagal memuat data detail nasabah.");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error("Error fetching pickups: ", err);
      setError("Gagal memuat data penjemputan. Pastikan Anda telah membuat indeks yang diperlukan di Firestore. Periksa konsol untuk pesan error detail.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateSubmit = async () => {
    if (!selectedPickup || !weight || parseFloat(weight) <= 0) {
      toast({
        title: "Error",
        description: "Berat sampah harus diisi dan lebih dari 0.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const pickupRef = doc(db, "pickups", selectedPickup.id);
      const calculatedPoints = Math.round(parseFloat(weight) * 1000); // 1 kg = 1000 points

      await updateDoc(pickupRef, {
        status: "Selesai",
        weight: weight,
        points: calculatedPoints,
      });

      toast({
        title: "Sukses",
        description: "Hasil penjemputan berhasil disimpan.",
      });

      setIsDialogOpen(false);
      setWeight('');
      setSelectedPickup(null);

    } catch (e) {
      console.error("Error updating document: ", e);
      toast({
        title: "Error",
        description: "Gagal memperbarui data. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDialogFor = (pickup: PickupWithUser) => {
    setSelectedPickup(pickup);
    setWeight('');
    setIsDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
        <h1 className="text-3xl font-bold font-headline">Jadwal Penjemputan</h1>
        <p className="text-muted-foreground">Berikut adalah daftar tugas penjemputan yang perlu diselesaikan.</p>
      </header>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Input Hasil Penjemputan</DialogTitle>
            <DialogDescription>
              Masukkan detail sampah yang dijemput dari {selectedPickup?.userName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Berat (kg)</label>
              <Input 
                type="number" 
                placeholder="Contoh: 5.5" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <Button onClick={handleUpdateSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {pickups.length > 0 ? (
        <div className="grid gap-6">
          {pickups.map((pickup) => (
            <Card key={pickup.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                  <CardHeader className="flex-1 p-6">
                      <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                              <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="profile picture" />
                              <AvatarFallback>{pickup.userInitial}</AvatarFallback>
                          </Avatar>
                          <div>
                              <CardTitle className="text-lg capitalize">{pickup.userName}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{pickup.location || 'Alamat tidak tersedia'}</span>
                              </CardDescription>
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{pickup.date ? new Date(pickup.date.toDate()).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Tanggal tidak tersedia'}</span>
                              </div>
                          </div>
                      </div>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-end bg-secondary/50 p-6 sm:w-auto">
                      <Button onClick={() => openDialogFor(pickup)}>
                        Input Hasil <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                  </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
             <div className="flex flex-col items-center gap-4">
                <PackageCheck className="h-16 w-16 text-green-500" />
                <h3 className="text-xl font-semibold">Semua Pekerjaan Selesai!</h3>
                <p className="text-muted-foreground">Tidak ada jadwal penjemputan yang tertunda saat ini.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
