import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRidesStore } from "../store/useRidesStore";
import { useWalletStore } from "@/src/store/useWalletStore";
import { DeliveryUpsellBanner } from "../components/DeliveryUpsellBanner";

export default function PostRideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { activeRide, clearDraft } = useRidesStore();
  const { fetchWalletBalance, balanceInNaira } = useWalletStore();

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const handleDone = () => {
    clearDraft();
    router.replace("/(tabs)/keke" as any);
  };

  const handleUpsellTap = () => {
    console.log("[Telemetry] delivery_upsell_tapped");
    console.log("[Telemetry] delivery_first_attempt_from_keke");
  };

  useEffect(() => {
    console.log("[Telemetry] keke_ride_completed");
    console.log("[Telemetry] delivery_upsell_shown");
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Success icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={64} color="#01656c" />
        </View>
        <Text style={styles.title}>Ride Complete!</Text>
        <Text style={styles.subtitle}>You've arrived at your destination.</Text>

        {/* Receipt */}
        {activeRide && (
          <View style={styles.receipt}>
            <Text style={styles.receiptTitle}>Receipt</Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>From</Text>
              <Text style={styles.receiptValue}>{(activeRide.pickup as any)?.name ?? "—"}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>To</Text>
              <Text style={styles.receiptValue}>{(activeRide.dropoff as any)?.name ?? "—"}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Fare paid</Text>
              <Text style={styles.receiptFare}>₦{activeRide.fareNaira.toLocaleString()}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>New balance</Text>
              <Text style={styles.receiptBalance}>₦{balanceInNaira.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Delivery upsell */}
        <DeliveryUpsellBanner onTap={handleUpsellTap} />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.85}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  content: { flex: 1, padding: 24, gap: 16, alignItems: "center" },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e0f5f4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#022401" },
  subtitle: { fontSize: 15, color: "#545454" },
  receipt: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    gap: 8,
  },
  receiptTitle: { fontSize: 13, fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  receiptRow: { flexDirection: "row", justifyContent: "space-between" },
  receiptLabel: { fontSize: 14, color: "#545454" },
  receiptValue: { fontSize: 14, fontWeight: "500", color: "#022401" },
  receiptFare: { fontSize: 16, fontWeight: "700", color: "#022401" },
  receiptBalance: { fontSize: 14, fontWeight: "600", color: "#01656c" },
  divider: { height: 1, backgroundColor: "#f1f1f1", marginVertical: 4 },
  footer: { padding: 16 },
  doneBtn: {
    backgroundColor: "#022401",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
