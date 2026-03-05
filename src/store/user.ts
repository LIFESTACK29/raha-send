import { atom } from "jotai";

export interface Address {
    _id: string;
    name: string;
    location: string;
    landmark?: string;
}

export interface User {
    id?: string;
    clerkId: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    role: "customer" | "rider";
    isOnboarded: boolean;
    addresses?: Address[];
}

export const userAtom = atom<User | null>(null);
