import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Ride, RideStatus } from "../types";

const STATUS_LABEL: Partial<Record<RideStatus, string>> = {
  REQUESTED: "Looking for a rider...",
  ASSIGNED: "Rider assigned",
  RIDER_ON_THE_WAY: "Rider on the way",
  ARRIVED: "Rider has arrived",
  IN_PROGRESS: "Ride in progress",
};

interface ActiveRideBannerProps {
  ride: Ride;
}

export const ActiveRideBanner: React.FC<ActiveRideBannerProps> = ({ ride }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => router.push("/rides/status" as any)}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="navigate-circle" size={22} color="#fff" />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>Active Ride</Text>
        <Text style={styles.status}>{STATUS_LABEL[ride.status] ?? ride.status}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#01656c",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1 },
  label: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  status: { fontSize: 14, color: "#fff", fontWeight: "700", marginTop: 1 },
});
