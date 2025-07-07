import type { Timestamp } from 'firebase/firestore';

export interface Pickup {
    id: string;
    date: Timestamp;
    type: string;
    weight?: string;
    points?: number;
    status: 'Selesai' | 'Diproses' | 'Diajukan';
    userId: string;
    photoURL?: string | null;
    location?: string;
    createdAt?: Timestamp;
}

export interface Saving {
    month: string;
    earnings: number;
}
