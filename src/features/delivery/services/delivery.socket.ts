import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/src/api/config";
import {
  DeliveryAcceptedPayload,
  NoRiderFoundPayload,
} from "../types/delivery.types";

let socket: Socket | null = null;

/**
 * Connect to the delivery socket namespace.
 * Re-uses existing connection if already connected.
 */
export const connectDeliverySocket = async (): Promise<Socket> => {
  if (socket?.connected) return socket;

  const token = await SecureStore.getItemAsync("token");

  // Derive base URL from API URL (strip /api/v1)
  const baseUrl = API_URL.replace("/api/v1", "");

  socket = io(baseUrl, {
    transports: ["websocket"],
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  return socket;
};

/**
 * Listen for "delivery_accepted" events.
 */
export const onDeliveryAccepted = (
  callback: (payload: DeliveryAcceptedPayload) => void
) => {
  socket?.on("delivery_accepted", callback);
};

/**
 * Listen for "no_rider_found" events.
 */
export const onNoRiderFound = (
  callback: (payload: NoRiderFoundPayload) => void
) => {
  socket?.on("no_rider_found", callback);
};

/**
 * Remove all delivery-related listeners and disconnect.
 */
export const disconnectDeliverySocket = () => {
  if (socket) {
    socket.off("delivery_accepted");
    socket.off("no_rider_found");
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get the current socket instance (for advanced use).
 */
export const getDeliverySocket = (): Socket | null => socket;
