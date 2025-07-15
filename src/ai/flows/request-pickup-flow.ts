/**
 * @fileOverview Flow untuk menangani pengajuan penjemputan baru.
 *
 * - requestPickup: Fungsi yang menangani proses pengajuan penjemputan & notifikasi.
 * - RequestPickupInput: Tipe input untuk flow.
 * - RequestPickupOutput: Tipe output untuk flow.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const RequestPickupInputSchema = z.object({
  userId: z.string().describe('ID unik dari pengguna (nasabah).'),
  userEmail: z.string().describe('Email pengguna (nasabah).'),
  wasteType: z.string().describe('Jenis sampah yang akan dijemput.'),
  pickupTimestamp: z.string().describe('Waktu penjemputan dalam format ISO 8601.'),
  location: z.string().describe('Alamat lengkap lokasi penjemputan.'),
});
export type RequestPickupInput = z.infer<typeof RequestPickupInputSchema>;

export const RequestPickupOutputSchema = z.object({
  pickupId: z.string().describe('ID dari dokumen penjemputan yang baru dibuat di Firestore.'),
  notificationSent: z.boolean().describe('Apakah notifikasi berhasil dikirim atau tidak.'),
  message: z.string().describe('Pesan status hasil operasi.'),
});
export type RequestPickupOutput = z.infer<typeof RequestPickupOutputSchema>;


// Fungsi wrapper yang akan dipanggil dari client component
export async function requestPickup(input: RequestPickupInput): Promise<RequestPickupOutput> {
  return requestPickupFlow(input);
}


// Implementasi Flow
const requestPickupFlow = ai.defineFlow(
  {
    name: 'requestPickupFlow',
    inputSchema: RequestPickupInputSchema,
    outputSchema: RequestPickupOutputSchema,
  },
  async (input) => {
    // 1. Simpan data penjemputan ke Firestore
    const pickupDateTime = new Date(input.pickupTimestamp);
    const pickupTimestampFirestore = Timestamp.fromDate(pickupDateTime);

    const newPickupDoc = await addDoc(collection(db, 'pickups'), {
      userId: input.userId,
      type: input.wasteType,
      date: pickupTimestampFirestore,
      location: input.location,
      status: 'Diajukan',
      createdAt: Timestamp.now(),
    });

    // 2. Kirim notifikasi via CallMeBot
    const officerPhone = process.env.NEXT_PUBLIC_OFFICER_WHATSAPP_NUMBER;
    const callMeBotApiKey = process.env.NEXT_PUBLIC_CALLMEBOT_API_KEY;

    if (!officerPhone || !callMeBotApiKey) {
      console.warn("Variabel lingkungan untuk notifikasi WhatsApp tidak diatur. Melewatkan pengiriman notifikasi.");
      return {
        pickupId: newPickupDoc.id,
        notificationSent: false,
        message: 'Pengajuan disimpan, tetapi notifikasi tidak terkirim karena konfigurasi tidak lengkap.',
      };
    }

    try {
        const formattedDate = format(pickupDateTime, "eeee, dd MMMM yyyy 'pukul' HH:mm", { locale: id });
        let messageText = `Ada pengajuan penjemputan baru!\n\n`;
        messageText += `*Nasabah:* ${input.userEmail}\n`;
        messageText += `*Jenis Sampah:* ${input.wasteType}\n`;
        messageText += `*Jadwal:* ${formattedDate}\n`;
        messageText += `*Lokasi:* ${input.location}`;
        
        const encodedMessage = encodeURIComponent(messageText);
        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${officerPhone}&text=${encodedMessage}&apikey=${callMeBotApiKey}`;

        const response = await fetch(callMeBotUrl);
        if (!response.ok) {
            throw new Error(`CallMeBot API returned status ${response.status}`);
        }
        
        const responseText = await response.text();
        if (responseText.includes("ERROR")) {
            throw new Error(`CallMeBot API returned an error: ${responseText}`);
        }

        return {
            pickupId: newPickupDoc.id,
            notificationSent: true,
            message: 'Pengajuan berhasil disimpan dan notifikasi telah dikirim.',
        };

    } catch (error) {
        console.error("Gagal mengirim notifikasi WhatsApp:", error);
        return {
            pickupId: newPickupDoc.id,
            notificationSent: false,
            message: 'Pengajuan disimpan, tetapi gagal mengirim notifikasi ke petugas.',
        };
    }
  }
);
