import { useEffect, useRef } from "react";
import {
  subscribeToActiveRideUpdates,
  unsubscribeFromRideUpdates,
} from "../store/useRidesStore";

/**
 * Subscribe to ride socket events for the duration of the component's lifetime.
 * Safe to call from multiple components — only one socket subscription is created.
 */
export const useRideStatusUpdates = () => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    subscribeToActiveRideUpdates();

    return () => {
      unsubscribeFromRideUpdates();
      mounted.current = false;
    };
  }, []);
};
