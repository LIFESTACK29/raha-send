export type RideStatus =
  | "REQUESTED"
  | "ASSIGNED"
  | "RIDER_ON_THE_WAY"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type LocationCategory =
  | "FACULTY"
  | "HOSTEL"
  | "GATE"
  | "LANDMARK"
  | "FOOD"
  | "ADMIN";

export interface CampusLocation {
  id: string;
  name: string;
  category: LocationCategory;
  aliases: string[];
  description?: string;
  displayOrder: number;
  zone: {
    _id: string;
    name: string;
    displayOrder: number;
  };
}

export interface RideQuote {
  fare: number;        // kobo
  fareNaira: number;
  availableBalance: number;   // kobo
  availableBalanceNaira: number;
  currency: string;
}

export interface RideRider {
  _id: string;
  firstName: string;
  lastName: string;
  kekeRiderProfile?: {
    tricycleIdentifier?: string;
    campusId?: string;
  };
}

export interface Ride {
  id: string;
  trackingId: string;
  status: RideStatus;
  campusId: string;
  fare: number;        // kobo
  fareNaira: number;
  pickup: CampusLocation;
  dropoff: CampusLocation;
  pickupZone?: { _id: string; name: string };
  dropoffZone?: { _id: string; name: string };
  assignedRider?: RideRider | null;
  assignedAt?: string;
  riderPayoutAmount?: number;
  platformCommissionAmount?: number;
  statusTimestamps: Partial<Record<RideStatus, string>>;
  cancelledBy?: "passenger" | "admin";
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type RideErrorCode =
  | "WALLET_NOT_FOUND"
  | "INSUFFICIENT_WALLET_BALANCE"
  | "ILLEGAL_RIDE_STATE_TRANSITION"
  | "NO_FARE_RULE";

export interface InsufficientBalanceData {
  required: number;
  requiredNaira: number;
  available: number;
  availableNaira: number;
  shortfall: number;
  shortfallNaira: number;
}

export interface RidesStoreState {
  // Locations
  activeCampusId: string | null;
  campusLocations: Partial<Record<LocationCategory, CampusLocation[]>>;
  locationsLoading: boolean;
  locationsError: string | null;

  // Selection
  selectedPickup: CampusLocation | null;
  selectedDropoff: CampusLocation | null;

  // Quote
  currentQuote: RideQuote | null;
  quoteLoading: boolean;
  quoteError: string | null;

  // Active ride
  activeRide: Ride | null;
  rideLoading: boolean;
  rideError: string | null;
  rideErrorCode: RideErrorCode | null;
  insufficientBalanceData: InsufficientBalanceData | null;

  // History
  rideHistory: Ride[];
  historyLoading: boolean;
  historyTotal: number;
  historyPage: number;

  // Actions
  loadCampusLocations: (campusId?: string) => Promise<void>;
  selectPickup: (location: CampusLocation | null) => void;
  selectDropoff: (location: CampusLocation | null) => void;
  swapLocations: () => void;
  fetchQuote: () => Promise<void>;
  requestRide: () => Promise<boolean>;
  fetchActiveRide: () => Promise<void>;
  cancelActiveRide: () => Promise<void>;
  confirmInProgress: () => Promise<boolean>;
  confirmCompleted: () => Promise<boolean>;
  loadRideHistory: (page?: number) => Promise<void>;
  clearDraft: () => void;
  clearRideError: () => void;
  _handleRideStatusEvent: (event: string, payload: any) => void;
}
