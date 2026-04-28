// ──────────────────────────────────────────────
// Location (provider-agnostic)
// ──────────────────────────────────────────────
export interface DeliveryLocation {
    address: string;
    lat: number;
    lng: number;
    shortName: string;
}

// ──────────────────────────────────────────────
// Contact Details
// ──────────────────────────────────────────────
export interface ContactDetails {
    fullName: string;
    email: string;
    phoneNumber: string;
}

// ──────────────────────────────────────────────
// Pricing / Fee
// ──────────────────────────────────────────────
export interface FeePricing {
    baseFee: number;
    distanceFee: number;
    totalFee: number;
    currency: string;
}

export interface Pricing {
    fee: number;
    currency: string;
}

export interface FeeQuote {
    distanceKm: number;
    pricing: FeePricing;
    route: {
        pickupLocation: DeliveryLocation;
        dropoffLocation: DeliveryLocation;
    };
}

export interface CalculateFeeResponse {
    success: boolean;
    data: FeeQuote;
}

// ──────────────────────────────────────────────
// Package
// ──────────────────────────────────────────────
export type PackageType =
    | "DOCUMENT"
    | "PARCEL"
    | "FRAGILE"
    | "FOOD"
    | "ELECTRONICS"
    | "OTHER";

export interface PackageInfo {
    type: PackageType;
    note?: string;
    imageUrl?: string;
}

// ──────────────────────────────────────────────
// Match Request (Search Phase)
// ──────────────────────────────────────────────
export type MatchRequestStatus =
    | "SEARCHING"
    | "NO_RIDER_FOUND"
    | "RIDER_ASSIGNED"
    | "MANUAL_CREATED"
    | "EXPIRED";

export interface MatchRequest {
    id: string;
    status: MatchRequestStatus;
    pricing: Pricing;
    route: {
        distanceKm: number;
        pickup: DeliveryLocation;
        dropoff: DeliveryLocation;
    };
    contact: {
        customer: ContactDetails;
        receiver: ContactDetails;
    };
    package: PackageInfo;
    matching: {
        nearbyRidersCount: number;
        radiusMeters: number;
        timeoutSeconds: number;
    };
    createdAt: string;
}

export interface RequestMatchResponse {
    success: boolean;
    message: string;
    matchRequest: MatchRequest;
}

export type RequestMatchErrorCode =
    | "WALLET_NOT_FOUND"
    | "INSUFFICIENT_WALLET_BALANCE";

export interface InsufficientWalletBalanceData {
    requiredAmount: number;
    requiredAmountInNaira: number;
    currentBalance: number;
    currentBalanceInNaira: number;
    shortfall: number;
    shortfallInNaira: number;
}

// ──────────────────────────────────────────────
// Delivery (Creation Phase)
// ──────────────────────────────────────────────
export type DeliveryStatus = "PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface Delivery {
    id: string;
    trackingId: string; // Generated only after delivery is created
    status: DeliveryStatus;
    pricing: Pricing;
    route: {
        distanceKm: number;
        pickup: DeliveryLocation;
        dropoff: DeliveryLocation;
    };
    contact: {
        customer: ContactDetails;
        receiver: ContactDetails;
    };
    package: PackageInfo;
    riderId?: string;
    rider?: Rider;
    matchRequestId?: string;
    createdAt: string;
}

// ──────────────────────────────────────────────
// Rider / Vehicle
// ──────────────────────────────────────────────
export interface Vehicle {
    type: string;
    brand: string;
    model: string;
    color: string;
    licensePlate: string;
}

export interface Rider {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profileImageUrl: string;
    riderStatus: string;
    phoneNumber: string;
    vehicle: Vehicle;
}

// ──────────────────────────────────────────────
// Socket Payloads
// ──────────────────────────────────────────────
export interface DeliveryAcceptedPayload {
    delivery: Delivery;
    rider: Rider;
    matchRequestId?: string;
}

export interface NoRiderAction {
    type: "wait_more" | "create_it_yourself";
    label: string;
    style?: "primary" | "secondary";
}

export interface NoRiderFoundPayload {
    matchRequestId: string;
    status: string;
    message: string;
    actions: NoRiderAction[];
}

// ──────────────────────────────────────────────
// Store & Draft
// ──────────────────────────────────────────────
export interface DeliveryDraft {
    pickupLocation: DeliveryLocation | null;
    dropoffLocation: DeliveryLocation | null;
    isSenderSelf: boolean;
    customer: ContactDetails;
    receiver: ContactDetails;
    packageType: PackageType;
    note: string;
    itemImage: string | null;
}

export type MatchingState =
    | "idle"
    | "searching"
    | "accepted"
    | "no_rider_found"
    | "manual_pending"
    | "error";

export interface DeliveryStoreState {
    // Form draft
    draft: DeliveryDraft;
    setPickup: (location: DeliveryLocation) => void;
    setDropoff: (location: DeliveryLocation) => void;
    setIsSenderSelf: (isSelf: boolean) => void;
    setCustomer: (details: Partial<ContactDetails>) => void;
    setReceiver: (details: Partial<ContactDetails>) => void;
    setPackageType: (type: PackageType) => void;
    setNote: (note: string) => void;
    setItemImage: (uri: string | null) => void;

    // Fee quote
    feeQuote: FeeQuote | null;
    feeLoading: boolean;
    feeError: string | null;
    calculateFee: () => Promise<void>;

    // Match Request (Phase 1)
    matchRequest: MatchRequest | null;
    requestLoading: boolean;
    requestError: string | null;
    requestErrorCode: RequestMatchErrorCode | null;
    insufficientBalanceData: InsufficientWalletBalanceData | null;
    clearRequestError: () => void;
    startRiderSearch: () => Promise<void>;

    // Actions for Match Request
    waitMore: () => Promise<void>;
    createManual: () => Promise<void>;

    // Delivery (Phase 2)
    delivery: Delivery | null;
    matchingState: MatchingState;
    setMatchingState: (state: MatchingState) => void;

    // Rider
    rider: Rider | null;
    setRider: (rider: Rider) => void;

    // Payloads
    noRiderPayload: NoRiderFoundPayload | null;
    setNoRiderPayload: (payload: NoRiderFoundPayload) => void;

    // Reset
    resetDelivery: () => void;
}
