import { api } from "@/src/api/config";
import { CampusLocation, Ride, RideQuote } from "../types";

export const ridesApi = {
  getCampusLocations: async (campusId?: string): Promise<{ campusId: string; data: Partial<Record<string, CampusLocation[]>> }> => {
    const { data } = await api.get("/campus/locations", {
      params: campusId ? { campusId } : {},
    });
    return { campusId: data.campusId, data: data.data };
  },

  getQuote: async (
    pickupLocationId: string,
    dropoffLocationId: string
  ): Promise<RideQuote> => {
    const { data } = await api.post("/rides/quote", {
      pickupLocationId,
      dropoffLocationId,
    });
    return data.data;
  },

  requestRide: async (
    pickupLocationId: string,
    dropoffLocationId: string
  ): Promise<Ride> => {
    const { data } = await api.post("/rides", {
      pickupLocationId,
      dropoffLocationId,
    });
    return data.data;
  },

  getRide: async (id: string): Promise<Ride> => {
    const { data } = await api.get(`/rides/${id}`);
    return data.data;
  },

  getMyRides: async (
    page = 1,
    limit = 20,
    status?: string
  ): Promise<{ rides: Ride[]; total: number; pages: number }> => {
    const { data } = await api.get("/rides/my-rides", {
      params: { page, limit, ...(status ? { status } : {}) },
    });
    return { rides: data.data, total: data.pagination.total, pages: data.pagination.pages };
  },

  getMyActiveRide: async (): Promise<Ride | null> => {
    const { data } = await api.get("/rides/my-active-ride");
    return data.data;
  },

  cancelRide: async (id: string, reason?: string): Promise<void> => {
    await api.post(`/rides/${id}/cancel`, { reason });
  },

  updateRideStatus: async (id: string, status: "IN_PROGRESS" | "COMPLETED"): Promise<void> => {
    await api.post(`/rides/${id}/status`, { status });
  },
};
