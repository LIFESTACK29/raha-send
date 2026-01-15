type ActivityStatus = "Delivered" | "Ongoing" | "Cancelled";
type ActivityType = "send" | "courier"; // 'send' for plane icon, 'courier' for bike

export interface RecentActivity {
    id: string;
    location: string;
    timestamp: string;
    amount: string;
    status: ActivityStatus;
    type: ActivityType;
}

export const RECENT_ACTIVITIES: RecentActivity[] = [
    {
        id: "1",
        location: "Ozuoba - Ada-George",
        timestamp: "Yesterday, 8:35 AM",
        amount: "₦3,900",
        status: "Delivered",
        type: "send",
    },
    {
        id: "2",
        location: "Ozuoba - Ada-George",
        timestamp: "Yesterday, 8:35 AM",
        amount: "₦3,900",
        status: "Ongoing",
        type: "courier",
    },
    {
        id: "3",
        location: "Rumokoro - Choba",
        timestamp: "Today, 10:15 AM",
        amount: "₦2,500",
        status: "Ongoing",
        type: "send",
    },
    {
        id: "4",
        location: "Woji - Elelenwo",
        timestamp: "Today, 09:45 AM",
        amount: "₦1,800",
        status: "Delivered",
        type: "courier",
    },
    {
        id: "5",
        location: "G.R.A Phase 2 - Mile 1",
        timestamp: "Dec 26, 2:30 PM",
        amount: "₦4,200",
        status: "Cancelled",
        type: "send",
    },
    {
        id: "6",
        location: "Trans Amadi - Peter Odili",
        timestamp: "Dec 25, 11:20 AM",
        amount: "₦5,000",
        status: "Delivered",
        type: "courier",
    },
    {
        id: "7",
        location: "D-Line - Garrison",
        timestamp: "Dec 24, 4:10 PM",
        amount: "₦1,200",
        status: "Delivered",
        type: "send",
    },
    {
        id: "8",
        location: "Rumuola - Rumuigbo",
        timestamp: "Dec 24, 12:00 PM",
        amount: "₦2,800",
        status: "Delivered",
        type: "courier",
    },
    {
        id: "9",
        location: "Igwuruta - Airport Rd",
        timestamp: "Dec 23, 7:30 AM",
        amount: "₦6,500",
        status: "Ongoing",
        type: "send",
    },
    {
        id: "10",
        location: "Borikiri - Town",
        timestamp: "Dec 22, 5:45 PM",
        amount: "₦2,100",
        status: "Delivered",
        type: "courier",
    },
];
