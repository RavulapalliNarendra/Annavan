export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface UserProfile {
    uid: string;
    name: string;
    phoneNumber: string;
    role: UserRole;
    location?: string;
    createdAt: number;
}

export interface Crop {
    id: string;
    farmerId: string;
    farmerName: string;
    name: string;
    pricePerKg: number;
    quantityKg: number;
    location: string;
    imageUrl: string;
    description?: string;
    grade?: 'A' | 'B' | 'C';
    createdAt: number;
}

export interface Order {
    id: string;
    buyerId: string;
    farmerId: string;
    cropId: string;
    cropName: string;
    quantityKg: number;
    totalPrice: number;
    status: 'pending' | 'approved' | 'rejected' | 'paid' | 'completed';
    createdAt: number;
}

export interface MarketPrice {
    id: string;
    cropName: string;
    location: string;
    pricePerKg: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: number;
}
