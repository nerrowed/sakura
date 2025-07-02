export interface Pickup {
    id: string;
    date: string;
    type: string;
    weight: string;
    points: string;
    status: 'Selesai' | 'Diproses' | 'Diajukan' | 'Menunggu';
    userId: string;
}

export interface Saving {
    month: string;
    earnings: number;
}
