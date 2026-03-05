type OrderStatus = "Delivered" | "Ongoing" | "Cancelled";

export interface Order {
    id: string;
    trackingId: string;
    from: string;
    to: string;
    status: OrderStatus;
    date: string;
    amount: string;
    packageType: string;
}

export const ORDERS: Order[] = [
    {
        id: "1",
        trackingId: "RS-20251211-001",
        from: "Ozuoba",
        to: "Ada-George",
        status: "Ongoing",
        date: "Today, 10:30 AM",
        amount: "₦3,900",
        packageType: "Documents",
    },
    {
        id: "2",
        trackingId: "RS-20251211-002",
        from: "Rumokoro",
        to: "Choba",
        status: "Ongoing",
        date: "Today, 09:15 AM",
        amount: "₦2,500",
        packageType: "Food",
    },
    {
        id: "3",
        trackingId: "RS-20251210-003",
        from: "Woji",
        to: "Elelenwo",
        status: "Delivered",
        date: "Yesterday, 3:45 PM",
        amount: "₦1,800",
        packageType: "Gadgets",
    },
    {
        id: "4",
        trackingId: "RS-20251210-004",
        from: "G.R.A Phase 2",
        to: "Mile 1",
        status: "Delivered",
        date: "Yesterday, 11:20 AM",
        amount: "₦4,200",
        packageType: "Clothes",
    },
    {
        id: "5",
        trackingId: "RS-20251209-005",
        from: "Trans Amadi",
        to: "Peter Odili",
        status: "Cancelled",
        date: "Dec 9, 2:30 PM",
        amount: "₦5,000",
        packageType: "Books",
    },
    {
        id: "6",
        trackingId: "RS-20251208-006",
        from: "D-Line",
        to: "Garrison",
        status: "Delivered",
        date: "Dec 8, 4:10 PM",
        amount: "₦1,200",
        packageType: "Medicine",
    },
    {
        id: "7",
        trackingId: "RS-20251207-007",
        from: "Rumuola",
        to: "Rumuigbo",
        status: "Delivered",
        date: "Dec 7, 12:00 PM",
        amount: "₦2,800",
        packageType: "Documents",
    },
    {
        id: "8",
        trackingId: "RS-20251206-008",
        from: "Igwuruta",
        to: "Airport Rd",
        status: "Delivered",
        date: "Dec 6, 7:30 AM",
        amount: "₦6,500",
        packageType: "Gadgets",
    },
];
