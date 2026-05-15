import { create } from "zustand";
import { ridesApi } from "../services/rides.api";
import { subscribeToRideEvents } from "../services/rides.socket";
import {
  CampusLocation,
  LocationCategory,
  Ride,
  RideQuote,
  RideErrorCode,
  InsufficientBalanceData,
  RidesStoreState,
} from "../types";

let socketUnsubscribe: (() => void) | null = null;

// Normalizes raw MongoDB socket payloads to the Ride type shape
function normalizeRide(raw: any): Ride {
  return {
    ...raw,
    id: raw.id ?? raw._id,
    fareNaira: raw.fareNaira ?? (raw.fare != null ? raw.fare / 100 : 0),
    pickup: raw.pickup ?? raw.pickupLocationId,
    dropoff: raw.dropoff ?? raw.dropoffLocationId,
    assignedRider: raw.assignedRider ?? raw.assignedRiderId ?? null,
  };
}

export const useRidesStore = create<RidesStoreState>((set, get) => ({
  activeCampusId: null,
  campusLocations: {},
  locationsLoading: false,
  locationsError: null,

  selectedPickup: null,
  selectedDropoff: null,

  currentQuote: null,
  quoteLoading: false,
  quoteError: null,

  activeRide: null,
  rideLoading: false,
  rideError: null,
  rideErrorCode: null,
  insufficientBalanceData: null,

  rideHistory: [],
  historyLoading: false,
  historyTotal: 0,
  historyPage: 1,

  loadCampusLocations: async (campusId?: string) => {
    set({ locationsLoading: true, locationsError: null });
    try {
      const result = await ridesApi.getCampusLocations(campusId);
      set({
        activeCampusId: result.campusId,
        campusLocations: result.data as Partial<Record<LocationCategory, CampusLocation[]>>,
      });
    } catch {
      set({ locationsError: "Failed to load campus locations" });
    } finally {
      set({ locationsLoading: false });
    }
  },

  selectPickup: (location) => {
    set({ selectedPickup: location, currentQuote: null, quoteError: null });
    const { selectedDropoff } = get();
    if (location && selectedDropoff) get().fetchQuote();
  },

  selectDropoff: (location) => {
    set({ selectedDropoff: location, currentQuote: null, quoteError: null });
    const { selectedPickup } = get();
    if (location && selectedPickup) get().fetchQuote();
  },

  swapLocations: () => {
    const { selectedPickup, selectedDropoff } = get();
    set({
      selectedPickup: selectedDropoff,
      selectedDropoff: selectedPickup,
      currentQuote: null,
      quoteError: null,
    });
    if (selectedPickup && selectedDropoff) get().fetchQuote();
  },

  fetchQuote: async () => {
    const { selectedPickup, selectedDropoff } = get();
    if (!selectedPickup || !selectedDropoff) return;

    set({ quoteLoading: true, quoteError: null, currentQuote: null });
    try {
      const quote = await ridesApi.getQuote(selectedPickup.id, selectedDropoff.id);
      set({ currentQuote: quote });
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const msg = err?.response?.data?.message ?? "Failed to get fare quote";
      set({ quoteError: msg, rideErrorCode: code ?? null });
    } finally {
      set({ quoteLoading: false });
    }
  },

  requestRide: async () => {
    const { selectedPickup, selectedDropoff } = get();
    if (!selectedPickup || !selectedDropoff) return false;

    set({ rideLoading: true, rideError: null, rideErrorCode: null, insufficientBalanceData: null });
    try {
      const ride = await ridesApi.requestRide(selectedPickup.id, selectedDropoff.id);
      set({ activeRide: ride });
      return true;
    } catch (err: any) {
      const code: RideErrorCode = err?.response?.data?.code;
      const msg = err?.response?.data?.message ?? "Failed to request ride";
      const balanceData: InsufficientBalanceData | null =
        code === "INSUFFICIENT_WALLET_BALANCE"
          ? {
              required: err.response.data.required,
              requiredNaira: err.response.data.requiredNaira,
              available: err.response.data.available,
              availableNaira: err.response.data.availableNaira,
              shortfall: err.response.data.shortfall,
              shortfallNaira: err.response.data.shortfallNaira,
            }
          : null;
      set({ rideError: msg, rideErrorCode: code ?? null, insufficientBalanceData: balanceData });
      return false;
    } finally {
      set({ rideLoading: false });
    }
  },

  fetchActiveRide: async () => {
    try {
      const ride = await ridesApi.getMyActiveRide();
      set({ activeRide: ride ? normalizeRide(ride) : null });
    } catch {
      // silently fail — store keeps whatever it already has
    }
  },

  cancelActiveRide: async () => {
    const { activeRide } = get();
    if (!activeRide) return;
    try {
      await ridesApi.cancelRide(activeRide.id);
      set({ activeRide: { ...activeRide, status: "CANCELLED" } });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to cancel ride";
      set({ rideError: msg });
    }
  },

  confirmInProgress: async (): Promise<boolean> => {
    const { activeRide } = get();
    if (!activeRide) return false;
    set({ rideLoading: true, rideError: null });
    try {
      await ridesApi.updateRideStatus(activeRide.id, "IN_PROGRESS");
      set({ activeRide: { ...activeRide, status: "IN_PROGRESS" } });
      return true;
    } catch (err: any) {
      set({ rideError: err?.response?.data?.message ?? "Failed to confirm ride start" });
      return false;
    } finally {
      set({ rideLoading: false });
    }
  },

  confirmCompleted: async (): Promise<boolean> => {
    const { activeRide } = get();
    if (!activeRide) return false;
    set({ rideLoading: true, rideError: null });
    try {
      await ridesApi.updateRideStatus(activeRide.id, "COMPLETED");
      set({ activeRide: { ...activeRide, status: "COMPLETED" } });
      return true;
    } catch (err: any) {
      set({ rideError: err?.response?.data?.message ?? "Failed to confirm ride completion" });
      return false;
    } finally {
      set({ rideLoading: false });
    }
  },

  loadRideHistory: async (page = 1) => {
    set({ historyLoading: true });
    try {
      const { rides, total } = await ridesApi.getMyRides(page);
      set((state) => ({
        rideHistory: page === 1 ? rides : [...state.rideHistory, ...rides],
        historyTotal: total,
        historyPage: page,
      }));
    } catch {
      // silently fail — user can pull to refresh
    } finally {
      set({ historyLoading: false });
    }
  },

  clearDraft: () => {
    set({
      selectedPickup: null,
      selectedDropoff: null,
      currentQuote: null,
      quoteError: null,
      rideError: null,
      rideErrorCode: null,
      insufficientBalanceData: null,
    });
  },

  clearRideError: () => {
    set({ rideError: null, rideErrorCode: null, insufficientBalanceData: null });
  },

  _handleRideStatusEvent: (event, payload) => {
    switch (event) {
      case "ride_assigned":
        set({ activeRide: normalizeRide(payload.ride ?? payload) });
        break;
      case "ride_status_update":
        set((state) => ({
          activeRide: state.activeRide
            ? { ...state.activeRide, status: payload.status }
            : state.activeRide,
        }));
        break;
      case "ride_completed":
        set((state) => ({
          activeRide: state.activeRide
            ? { ...state.activeRide, status: "COMPLETED" }
            : state.activeRide,
        }));
        break;
      case "ride_cancelled":
        set((state) => ({
          activeRide: state.activeRide
            ? {
                ...state.activeRide,
                status: "CANCELLED",
                cancellationReason: payload.reason,
              }
            : state.activeRide,
        }));
        break;
    }
  },
}));

export const subscribeToActiveRideUpdates = async () => {
  if (socketUnsubscribe) return; // already subscribed
  socketUnsubscribe = await subscribeToRideEvents((event, payload) => {
    useRidesStore.getState()._handleRideStatusEvent(event, payload);
  });
};

export const unsubscribeFromRideUpdates = () => {
  socketUnsubscribe?.();
  socketUnsubscribe = null;
};
