import {
  connectDeliverySocket,
  getDeliverySocket,
} from "@/src/features/delivery/services/delivery.socket";

const RIDE_EVENTS = [
  "ride_assigned",
  "ride_status_update",
  "ride_completed",
  "ride_cancelled",
] as const;

type RideEvent = (typeof RIDE_EVENTS)[number];

/**
 * Subscribe to ride socket events. Reuses the shared delivery socket connection.
 * Returns an unsubscribe function.
 */
export const subscribeToRideEvents = async (
  handler: (event: RideEvent, payload: any) => void
): Promise<() => void> => {
  // Ensure the socket is connected (reuses existing connection)
  await connectDeliverySocket();
  const socket = getDeliverySocket();

  if (!socket) return () => {};

  const listeners: Array<() => void> = [];

  for (const event of RIDE_EVENTS) {
    const cb = (payload: any) => handler(event, payload);
    socket.on(event, cb);
    listeners.push(() => socket.off(event, cb));
  }

  return () => listeners.forEach((unsub) => unsub());
};
