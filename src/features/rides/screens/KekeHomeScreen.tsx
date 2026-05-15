import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useWalletStore } from "@/src/store/useWalletStore";
import { useRidesStore } from "../store/useRidesStore";
import { useCampusLocations } from "../hooks/useCampusLocations";
import { LocationPicker } from "../components/LocationPicker";
import { FarePreview } from "../components/FarePreview";
import { ActiveRideBanner } from "../components/ActiveRideBanner";
import { CampusLocation } from "../types";

type PickerTarget = "pickup" | "dropoff" | null;

export default function KekeHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { balanceInNaira, hasWallet, fetchWalletBalance } = useWalletStore();
  const {
    selectedPickup,
    selectedDropoff,
    currentQuote,
    quoteLoading,
    quoteError,
    activeRide,
    selectPickup,
    selectDropoff,
    swapLocations,
    clearDraft,
    fetchActiveRide,
  } = useRidesStore();

  const { campusLocations, locationsLoading, reload } = useCampusLocations();

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchWalletBalance();
      reload();
      fetchActiveRide();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchWalletBalance(), reload()]);
    setRefreshing(false);
  };

  const handlePickerSelect = (loc: CampusLocation) => {
    if (pickerTarget === "pickup") selectPickup(loc);
    else if (pickerTarget === "dropoff") selectDropoff(loc);
  };

  const canRequest = !!currentQuote && !quoteLoading;

  if (!hasWallet) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Keke Rides</Text>
        </View>
        <View style={styles.noWallet}>
          <Ionicons name="wallet-outline" size={48} color="#9ca3af" />
          <Text style={styles.noWalletTitle}>No wallet yet</Text>
          <Text style={styles.noWalletSub}>
            Create a wallet to start booking keke rides on campus.
          </Text>
          <TouchableOpacity
            style={styles.createWalletBtn}
            onPress={() => router.push("/(tabs)/wallet" as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.createWalletBtnText}>Create Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Keke Rides</Text>
          <Text style={styles.headerSub}>Campus rides, made easy</Text>
        </View>
        <View style={styles.balancePill}>
          <Ionicons name="wallet-outline" size={14} color="#01656c" />
          <Text style={styles.balanceText}>₦{balanceInNaira.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#01656c" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Active ride banner */}
        {activeRide && !["COMPLETED", "CANCELLED"].includes(activeRide.status) && (
          <ActiveRideBanner ride={activeRide} />
        )}

        {/* Route card */}
        <View style={styles.routeCard}>
          <Text style={styles.routeCardTitle}>Where to?</Text>

          {/* Pickup */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => setPickerTarget("pickup")}
            activeOpacity={0.75}
          >
            <View style={[styles.locationDot, styles.pickupDot]} />
            <Text style={[styles.locationText, !selectedPickup && styles.locationPlaceholder]}>
              {selectedPickup?.name ?? "Select pickup location"}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>

          {/* Swap button */}
          <TouchableOpacity style={styles.swapBtn} onPress={swapLocations} activeOpacity={0.7}>
            <Ionicons name="swap-vertical" size={18} color="#01656c" />
          </TouchableOpacity>

          {/* Dropoff */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => setPickerTarget("dropoff")}
            activeOpacity={0.75}
          >
            <View style={[styles.locationDot, styles.dropoffDot]} />
            <Text style={[styles.locationText, !selectedDropoff && styles.locationPlaceholder]}>
              {selectedDropoff?.name ?? "Select drop-off location"}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Fare preview */}
        <FarePreview
          quote={currentQuote}
          loading={quoteLoading}
          error={quoteError}
        />

        {/* CTA */}
        {canRequest && (
          <TouchableOpacity
            style={styles.requestBtn}
            onPress={() => router.push("/rides/confirm" as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.requestBtnText}>Request Ride</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        {/* History link */}
        <TouchableOpacity
          style={styles.historyLink}
          onPress={() => router.push("/rides/history" as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="time-outline" size={16} color="#01656c" />
          <Text style={styles.historyLinkText}>Ride history</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={handlePickerSelect}
        campusLocations={campusLocations}
        loading={locationsLoading}
        title={pickerTarget === "pickup" ? "Pickup Location" : "Drop-off Location"}
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
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: "#f2f2f2",
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#022401" },
  headerSub: { fontSize: 13, color: "#9ca3af", marginTop: 2 },
  balancePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  balanceText: { fontSize: 13, fontWeight: "600", color: "#022401" },
  noWallet: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
  noWalletTitle: { fontSize: 20, fontWeight: "700", color: "#022401" },
  noWalletSub: { fontSize: 14, color: "#545454", textAlign: "center" },
  createWalletBtn: {
    backgroundColor: "#01656c",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 8,
  },
  createWalletBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  routeCardTitle: { fontSize: 16, fontWeight: "700", color: "#022401", marginBottom: 12 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    gap: 12,
  },
  locationDot: { width: 12, height: 12, borderRadius: 6 },
  pickupDot: { backgroundColor: "#01656c" },
  dropoffDot: { backgroundColor: "#f96007" },
  locationText: { flex: 1, fontSize: 15, color: "#022401", fontWeight: "500" },
  locationPlaceholder: { color: "#9ca3af", fontWeight: "400" },
  swapBtn: {
    alignSelf: "flex-end",
    padding: 6,
    backgroundColor: "#f0faf9",
    borderRadius: 8,
    marginVertical: 4,
  },
  requestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#022401",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    gap: 8,
  },
  requestBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  historyLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },
  historyLinkText: { fontSize: 14, color: "#01656c", fontWeight: "500" },
});
