import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRidesStore } from "../store/useRidesStore";
import { useRideStatusUpdates } from "../hooks/useRideStatusUpdates";
import { StatusTimeline } from "../components/StatusTimeline";
import { ConfirmModal } from "../components/ConfirmModal";
import { Ride } from "../types";

const STATUS_MESSAGE: Partial<Record<string, string>> = {
  REQUESTED: "Your ride request has been received. Waiting for a rider to be assigned.",
  ASSIGNED: "A Send Pilot has been assigned to your ride.",
  RIDER_ON_THE_WAY: "Your Send Pilot is on the way to pick you up.",
  ARRIVED: "Your Send Pilot has arrived at the pickup point.",
  IN_PROGRESS: "You're on your way! Enjoy the ride.",
  COMPLETED: "You have arrived. Thank you for riding with SEND!",
  CANCELLED: "This ride has been cancelled.",
};

interface Props {
  readOnly?: boolean;
  rideData?: Ride | null;
}

export default function RideStatusScreen({ readOnly = false, rideData = null }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { activeRide, cancelActiveRide, confirmInProgress, confirmCompleted, rideLoading, rideError, clearRideError } = useRidesStore();
  useRideStatusUpdates();

  const ride = readOnly ? rideData ?? null : activeRide;

  const [modal, setModal] = useState<"cancel" | "start" | "complete" | null>(null);

  const closeModal = () => {
    setModal(null);
    clearRideError();
  };

  // Navigate away when ride is completed
  useEffect(() => {
    if (!readOnly && activeRide?.status === "COMPLETED") {
      router.replace("/rides/post-ride" as any);
    }
  }, [activeRide?.status]);

  if (!ride) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#022401" />
        </TouchableOpacity>
        <View style={styles.center}>
          <ActivityIndicator color="#01656c" />
        </View>
      </View>
    );
  }

  const showRiderCard = ride.status !== "REQUESTED" && ride.assignedRider;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#022401" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Status</Text>
        <Text style={styles.trackingId}>{ride.trackingId}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Status message */}
        <View style={styles.statusMsgCard}>
          <Text style={styles.statusMsg}>{STATUS_MESSAGE[ride.status] ?? ride.status}</Text>
        </View>

        {/* Route summary */}
        <View style={styles.card}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, styles.pickupDot]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>From</Text>
              <Text style={styles.routeValue}>{(ride.pickup as any)?.name ?? "—"}</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, styles.dropoffDot]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>To</Text>
              <Text style={styles.routeValue}>{(ride.dropoff as any)?.name ?? "—"}</Text>
            </View>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Fare</Text>
            <Text style={styles.fareValue}>₦{(ride.fareNaira ?? ride.fare / 100).toLocaleString()}</Text>
          </View>
        </View>

        {/* Rider card */}
        {showRiderCard && ride.assignedRider && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Send Pilot</Text>
            <View style={styles.riderRow}>
              <View style={styles.riderAvatar}>
                <Ionicons name="person" size={24} color="#01656c" />
              </View>
              <View style={styles.riderInfo}>
                <Text style={styles.riderName}>
                  {ride.assignedRider.firstName} {ride.assignedRider.lastName}
                </Text>
                {ride.assignedRider.kekeRiderProfile?.tricycleIdentifier && (
                  <Text style={styles.riderVehicle}>
                    {ride.assignedRider.kekeRiderProfile.tricycleIdentifier}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Status Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride Progress</Text>
          <StatusTimeline currentStatus={ride.status} />
        </View>

        {/* Action buttons */}
        {!readOnly && ride.status === "RIDER_ON_THE_WAY" && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.confirmBtn]}
            onPress={() => setModal("start")}
            activeOpacity={0.75}
            disabled={rideLoading}
          >
            <Text style={styles.confirmBtnText}>Rider is Here</Text>
          </TouchableOpacity>
        )}

        {!readOnly && ride.status === "IN_PROGRESS" && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.confirmBtn]}
            onPress={() => setModal("complete")}
            activeOpacity={0.75}
            disabled={rideLoading}
          >
            <Text style={styles.confirmBtnText}>Complete Ride</Text>
          </TouchableOpacity>
        )}

        {!readOnly && ride.status === "REQUESTED" && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => setModal("cancel")}
            activeOpacity={0.75}
          >
            <Text style={styles.cancelBtnText}>Cancel Ride</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Start ride modal */}
      <ConfirmModal
        visible={modal === "start"}
        title="Rider Has Arrived?"
        message={`Confirm that the keke rider is at your pickup point and you're about to board. Your wallet will be charged ₦${(ride.fareNaira ?? ride.fare / 100).toLocaleString()} now.`}
        confirmLabel="Yes, Start Ride"
        loading={rideLoading}
        error={rideError ?? undefined}
        onConfirm={async () => {
          const ok = await confirmInProgress();
          if (ok) closeModal();
        }}
        onCancel={closeModal}
      />

      {/* Complete ride modal */}
      <ConfirmModal
        visible={modal === "complete"}
        title="Arrived at Destination?"
        message="Confirm that you have reached your drop-off point and the ride is complete."
        confirmLabel="Yes, Complete Ride"
        loading={rideLoading}
        error={rideError ?? undefined}
        onConfirm={async () => {
          const ok = await confirmCompleted();
          if (ok) closeModal();
        }}
        onCancel={closeModal}
      />

      {/* Cancel ride modal */}
      <ConfirmModal
        visible={modal === "cancel"}
        title="Cancel Ride?"
        message="Are you sure you want to cancel this ride? Your wallet hold will be released."
        confirmLabel="Yes, Cancel Ride"
        confirmColor="#dc2626"
        onConfirm={async () => {
          setModal(null);
          await cancelActiveRide();
          router.replace("/(tabs)/keke" as any);
        }}
        onCancel={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", color: "#022401" },
  trackingId: { fontSize: 12, color: "#9ca3af" },
  backBtn: { padding: 4 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  statusMsgCard: {
    backgroundColor: "#f0faf9",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#01656c",
  },
  statusMsg: { fontSize: 14, color: "#022401", lineHeight: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  cardTitle: { fontSize: 13, fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  routeRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  pickupDot: { backgroundColor: "#01656c" },
  dropoffDot: { backgroundColor: "#f96007" },
  routeConnector: { width: 2, height: 16, backgroundColor: "#e5e7eb", marginLeft: 5, marginVertical: 4 },
  routeText: { flex: 1 },
  routeLabel: { fontSize: 11, color: "#9ca3af", fontWeight: "600", textTransform: "uppercase" },
  routeValue: { fontSize: 15, fontWeight: "600", color: "#022401" },
  fareRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f1f1f1" },
  fareLabel: { fontSize: 14, color: "#545454" },
  fareValue: { fontSize: 16, fontWeight: "700", color: "#022401" },
  riderRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0f5f4",
    alignItems: "center",
    justifyContent: "center",
  },
  riderInfo: { flex: 1 },
  riderName: { fontSize: 16, fontWeight: "700", color: "#022401" },
  riderVehicle: { fontSize: 13, color: "#9ca3af", marginTop: 2 },
  actionBtn: {
    marginHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  confirmBtn: { backgroundColor: "#022401" },
  confirmBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cancelBtn: { borderWidth: 1, borderColor: "#dc2626" },
  cancelBtnText: { color: "#dc2626", fontWeight: "700", fontSize: 15 },
});
