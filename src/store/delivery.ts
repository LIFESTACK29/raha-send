import { atom } from "jotai";

export interface ActiveDelivery {
    _id: string;
    trackingId: string;
    pickupLocation: string;
    dropoffLocation: string;
    packageType: string;
    deliveryNote?: string;
    fee: number;
    status: string;
    customerId: string;
    riderId?: string;
}

export const activeDeliveryAtom = atom<ActiveDelivery | null>(null);

export interface DeliveryRequest {
    pickupLocation: string;
    dropoffLocation: string;
    deliveryNote: string;
    packageType: string;
    packageDescription?: string;
    fee: number;
}

export const deliveryRequestAtom = atom<DeliveryRequest>({
    pickupLocation: "",
    dropoffLocation: "",
    deliveryNote: "",
    packageType: "Package",
    fee: 3900,
});
