import { api } from "@/src/api/config";
import {
  CalculateFeeResponse,
  ContactDetails,
  DeliveryLocation,
  RequestMatchResponse,
  PackageType,
  Delivery,
} from "../types/delivery.types";

export const deliveryService = {
  /**
   * Calculate delivery fee based on pickup and dropoff locations.
   */
  calculateFee: async (
    pickupLocation: DeliveryLocation,
    dropoffLocation: DeliveryLocation
  ): Promise<CalculateFeeResponse> => {
    const response = await api.post<CalculateFeeResponse>(
      "/deliveries/calculate-fee",
      { pickupLocation, dropoffLocation }
    );
    return response.data;
  },

  /**
   * Start Rider Search (Phase 1)
   * Calls POST /deliveries/request and returns a matchRequest.
   */
  requestMatch: async (payload: {
    pickupLocation: DeliveryLocation;
    dropoffLocation: DeliveryLocation;
    customer: ContactDetails;
    receiver: ContactDetails;
    packageType: PackageType;
    note?: string;
    itemImageUri: string;
  }): Promise<RequestMatchResponse> => {
    const formData = new FormData();

    formData.append("pickupLocation", JSON.stringify(payload.pickupLocation));
    formData.append("dropoffLocation", JSON.stringify(payload.dropoffLocation));
    formData.append("customer", JSON.stringify(payload.customer));
    formData.append("receiver", JSON.stringify(payload.receiver));
    formData.append("packageType", payload.packageType);
    if (payload.note) {
      formData.append("note", payload.note);
    }

    // Attach the image file
    const filename = payload.itemImageUri.split("/").pop() || "item.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("itemImage", {
      uri: payload.itemImageUri,
      name: filename,
      type: mimeType,
    } as any);

    const response = await api.post<RequestMatchResponse>(
      "/deliveries/request",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * Keep Waiting (Phase 1 extension)
   * Calls POST /deliveries/match-requests/:id/wait-more
   */
  waitMore: async (matchRequestId: string): Promise<{ success: boolean }> => {
    const response = await api.post(`/deliveries/match-requests/${matchRequestId}/wait-more`);
    return response.data;
  },

  /**
   * Create Manual Delivery (Phase 1 fallback)
   * Calls POST /deliveries/match-requests/:id/create-manual
   * Returns created delivery (status PENDING).
   */
  createManual: async (matchRequestId: string): Promise<{ success: boolean; delivery: Delivery }> => {
    const response = await api.post(`/deliveries/match-requests/${matchRequestId}/create-manual`);
    return response.data;
  },
};
