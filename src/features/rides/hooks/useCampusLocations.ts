import { useEffect } from "react";
import { useRidesStore } from "../store/useRidesStore";

export const useCampusLocations = () => {
  const {
    activeCampusId,
    campusLocations,
    locationsLoading,
    locationsError,
    loadCampusLocations,
  } = useRidesStore();

  useEffect(() => {
    if (Object.keys(campusLocations).length === 0) {
      loadCampusLocations(); // backend auto-resolves to the first active campus
    }
  }, []);

  const allLocations = Object.values(campusLocations).flat();

  return {
    activeCampusId,
    campusLocations,
    allLocations,
    locationsLoading,
    locationsError,
    reload: () => loadCampusLocations(),
  };
};
