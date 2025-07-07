export interface Pickup {
    id: string;
    date: any;
    type: string;
    weight?: string;
    points?: number;
    status: 'Selesai' | 'Diproses' | 'Diajukan' | 'Menunggu';
    userId: string;
    photoURL?: string | null;
    location?: string;
    createdAt?: any;
}

export interface Saving {
    month: string;
    earnings: number;
}
