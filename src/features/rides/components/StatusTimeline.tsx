import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RideStatus } from "../types";

const STEPS: Array<{ status: RideStatus; label: string }> = [
  { status: "REQUESTED", label: "Ride Requested" },
  { status: "ASSIGNED", label: "Rider Assigned" },
  { status: "RIDER_ON_THE_WAY", label: "Rider on the Way" },
  { status: "ARRIVED", label: "Rider Arrived" },
  { status: "IN_PROGRESS", label: "Ride in Progress" },
  { status: "COMPLETED", label: "Completed" },
];

const STATUS_ORDER: Record<RideStatus, number> = {
  REQUESTED: 0,
  ASSIGNED: 1,
  RIDER_ON_THE_WAY: 2,
  ARRIVED: 3,
  IN_PROGRESS: 4,
  COMPLETED: 5,
  CANCELLED: -1,
};

interface StatusTimelineProps {
  currentStatus: RideStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const currentIdx = STATUS_ORDER[currentStatus] ?? -1;
  const isCancelled = currentStatus === "CANCELLED";

  if (isCancelled) {
    return (
      <View style={styles.cancelledRow}>
        <Ionicons name="close-circle" size={20} color="#dc2626" />
        <Text style={styles.cancelledText}>Ride Cancelled</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;

        return (
          <View key={step.status} style={styles.step}>
            {/* Connector line above */}
            {idx > 0 && (
              <View style={[styles.connector, isDone || isCurrent ? styles.connectorDone : styles.connectorFuture]} />
            )}

            <View style={styles.row}>
              <View
                style={[
                  styles.dot,
                  isDone && styles.dotDone,
                  isCurrent && styles.dotCurrent,
                  isFuture && styles.dotFuture,
                ]}
              >
                {isDone && <Ionicons name="checkmark" size={12} color="#fff" />}
                {isCurrent && <View style={styles.dotInner} />}
              </View>
              <Text
                style={[
                  styles.label,
                  isDone && styles.labelDone,
                  isCurrent && styles.labelCurrent,
                  isFuture && styles.labelFuture,
                ]}
              >
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  step: { position: "relative" },
  connector: {
    width: 2,
    height: 20,
    marginLeft: 11,
  },
  connectorDone: { backgroundColor: "#01656c" },
  connectorFuture: { backgroundColor: "#e5e7eb" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: { backgroundColor: "#01656c" },
  dotCurrent: { backgroundColor: "#01656c", borderWidth: 3, borderColor: "#bbcf8d" },
  dotFuture: { backgroundColor: "#e5e7eb" },
  dotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" },
  label: { fontSize: 14 },
  labelDone: { color: "#01656c", fontWeight: "500" },
  labelCurrent: { color: "#022401", fontWeight: "700" },
  labelFuture: { color: "#9ca3af" },
  cancelledRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  cancelledText: { fontSize: 15, fontWeight: "700", color: "#dc2626" },
});
