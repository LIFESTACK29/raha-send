import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useRidesStore } from "../store/useRidesStore";
import { Ride, RideStatus } from "../types";

const STATUS_CONFIG: Record<RideStatus, { label: string; bg: string; text: string }> = {
  REQUESTED:       { label: "Pending",    bg: "#fef9c3", text: "#854d0e" },
  ASSIGNED:        { label: "Assigned",   bg: "#dbeafe", text: "#1e40af" },
  RIDER_ON_THE_WAY:{ label: "En Route",   bg: "#dbeafe", text: "#1e40af" },
  ARRIVED:         { label: "Arrived",    bg: "#dbeafe", text: "#1e40af" },
  IN_PROGRESS:     { label: "In Progress",bg: "#dbeafe", text: "#1e40af" },
  COMPLETED:       { label: "Completed",  bg: "#dcfce7", text: "#166534" },
  CANCELLED:       { label: "Cancelled",  bg: "#fee2e2", text: "#991b1b" },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function RideHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { rideHistory, historyLoading, historyTotal, historyPage, loadRideHistory } =
    useRidesStore();

  useFocusEffect(
    useCallback(() => {
      loadRideHistory(1);
    }, [])
  );

  const loadMore = () => {
    if (rideHistory.length < historyTotal && !historyLoading) {
      loadRideHistory(historyPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Ride }) => {
    const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.REQUESTED;
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push(`/rides/${item.id}` as any)}
        activeOpacity={0.75}
      >
        <View style={styles.itemLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name="navigate-circle-outline" size={22} color="#01656c" />
          </View>
          <View style={styles.itemText}>
            <Text style={styles.itemRoute} numberOfLines={1}>
              {(item.pickup as any)?.name ?? "—"} → {(item.dropoff as any)?.name ?? "—"}
            </Text>
            <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemFare}>₦{item.fareNaira.toLocaleString()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.statusBadgeText, { color: cfg.text }]}>{cfg.label}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#022401" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={rideHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={historyLoading && historyPage === 1}
            onRefresh={() => loadRideHistory(1)}
            tintColor="#01656c"
          />
        }
        ListEmptyComponent={
          !historyLoading ? (
            <View style={styles.empty}>
              <Ionicons name="navigate-circle-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No rides yet</Text>
              <Text style={styles.emptySub}>Book your first keke ride to see history here</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          historyLoading && historyPage > 1 ? (
            <ActivityIndicator color="#01656c" style={{ padding: 16 }} />
          ) : null
        }
        contentContainerStyle={rideHistory.length === 0 ? styles.emptyContainer : { paddingBottom: insets.bottom + 16 }}
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
  },
  itemLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f5f4",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: { flex: 1 },
  itemRoute: { fontSize: 14, fontWeight: "600", color: "#022401" },
  itemDate: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  itemRight: { alignItems: "flex-end", gap: 4 },
  itemFare: { fontSize: 15, fontWeight: "700", color: "#022401" },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { fontSize: 11, fontWeight: "600" },
  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#022401" },
  emptySub: { fontSize: 14, color: "#9ca3af", textAlign: "center", paddingHorizontal: 32 },
  emptyContainer: { flexGrow: 1 },
});
