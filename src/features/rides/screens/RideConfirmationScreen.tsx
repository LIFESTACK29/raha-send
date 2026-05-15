import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useWalletStore } from "@/src/store/useWalletStore";
import { useRidesStore } from "../store/useRidesStore";
import { InsufficientBalanceModal } from "../components/InsufficientBalanceModal";

export default function RideConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { balanceInNaira } = useWalletStore();
  const {
    selectedPickup,
    selectedDropoff,
    currentQuote,
    rideLoading,
    rideError,
    rideErrorCode,
    insufficientBalanceData,
    requestRide,
    clearRideError,
  } = useRidesStore();

  const showInsufficient = rideErrorCode === "INSUFFICIENT_WALLET_BALANCE";

  const handleConfirm = async () => {
    const success = await requestRide();
    if (success) {
      router.replace("/rides/status" as any);
    }
  };

  if (!selectedPickup || !selectedDropoff || !currentQuote) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#022401" />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.errorMsg}>Missing ride details. Go back and try again.</Text>
        </View>
      </View>
    );
  }

  const postRideBalance = balanceInNaira - currentQuote.fareNaira;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#022401" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Ride</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Route summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route</Text>
          <View style={styles.routeRow}>
            <View style={[styles.dot, styles.pickupDot]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>{selectedPickup.name}</Text>
              <Text style={styles.routeZone}>{selectedPickup.zone?.name}</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, styles.dropoffDot]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Drop-off</Text>
              <Text style={styles.routeValue}>{selectedDropoff.name}</Text>
              <Text style={styles.routeZone}>{selectedDropoff.zone?.name}</Text>
            </View>
          </View>
        </View>

        {/* Fare breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fare Breakdown</Text>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Ride fare</Text>
            <Text style={styles.fareValue}>₦{currentQuote.fareNaira.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Current balance</Text>
            <Text style={styles.fareBalance}>₦{balanceInNaira.toLocaleString()}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Balance after ride</Text>
            <Text style={[styles.fareBalance, postRideBalance < 0 && { color: "#dc2626" }]}>
              ₦{postRideBalance.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Error message */}
        {rideError && !showInsufficient && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color="#991b1b" />
            <Text style={styles.errorBannerText}>{rideError}</Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.confirmBtn, rideLoading && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={rideLoading}
          activeOpacity={0.85}
        >
          {rideLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.confirmBtnText}>Confirm Ride — ₦{currentQuote.fareNaira.toLocaleString()}</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Insufficient balance modal */}
      <InsufficientBalanceModal
        visible={showInsufficient}
        onClose={clearRideError}
        data={insufficientBalanceData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#022401" },
  backBtn: { padding: 4 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorMsg: { color: "#991b1b", fontSize: 15, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 },
  routeRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  pickupDot: { backgroundColor: "#01656c" },
  dropoffDot: { backgroundColor: "#f96007" },
  routeConnector: { width: 2, height: 20, backgroundColor: "#e5e7eb", marginLeft: 5, marginVertical: 4 },
  routeText: { flex: 1 },
  routeLabel: { fontSize: 11, color: "#9ca3af", fontWeight: "600", textTransform: "uppercase" },
  routeValue: { fontSize: 15, fontWeight: "600", color: "#022401" },
  routeZone: { fontSize: 12, color: "#9ca3af" },
  fareRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  fareLabel: { fontSize: 14, color: "#545454" },
  fareValue: { fontSize: 20, fontWeight: "700", color: "#022401" },
  fareBalance: { fontSize: 14, fontWeight: "600", color: "#01656c" },
  divider: { height: 1, backgroundColor: "#f1f1f1", marginVertical: 4 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    gap: 8,
  },
  errorBannerText: { color: "#991b1b", fontSize: 13, flex: 1 },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#022401",
    borderRadius: 14,
    marginHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
