import React from "react";
import { useLocalSearchParams } from "expo-router";
import RideStatusScreen from "@/src/features/rides/screens/RideStatusScreen";
import { useRidesStore } from "@/src/features/rides/store/useRidesStore";
import { useEffect, useState } from "react";
import { ridesApi } from "@/src/features/rides/services/rides.api";
import { Ride } from "@/src/features/rides/types";

export default function RideDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    if (id) {
      ridesApi.getRide(id).then(setRide).catch(() => {});
    }
  }, [id]);

  return <RideStatusScreen readOnly rideData={ride} />;
}
