import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { deliveryService } from "@/src/features/delivery/services/delivery.api";
import { Delivery, DeliveryStatus } from "@/src/features/delivery/types/delivery.types";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    PENDING:   { label: "Pending",   bg: "#fef9c3", text: "#854d0e" },
    ONGOING:   { label: "Active",    bg: "#dbeafe", text: "#1e40af" },
    DELIVERED: { label: "Delivered", bg: "#dcfce7", text: "#166534" },
    CANCELLED: { label: "Cancelled", bg: "#fee2e2", text: "#991b1b" },
};

type FilterTab = "ALL" | DeliveryStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: "ALL",       label: "All"       },
    { key: "PENDING",   label: "Pending"   },
    { key: "ONGOING",   label: "Active"    },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatFee = (fee: number) => `₦${fee.toLocaleString()}`;

// ─── Delivery Card ────────────────────────────────────────────────────────────

function DeliveryCard({ item, onPress }: { item: Delivery; onPress: () => void }) {
    const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING;

    return (
        <TouchableOpacity
            className="border border-gray-100 rounded-2xl p-4 mx-5 mb-3"
            activeOpacity={0.75}
            onPress={onPress}
        >
            {/* Tracking ID + Status */}
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-walsheim-bold text-foreground" numberOfLines={1}>
                    {item.trackingId}
                </Text>
                <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: cfg.bg }}
                >
                    <Text className="text-xs font-semibold" style={{ color: cfg.text }}>
                        {cfg.label}
                    </Text>
                </View>
            </View>

            {/* Recipient */}
            <Text className="text-xs text-gray-blue mb-3">
                To: {item.contact.receiver.fullName}
            </Text>

            <View className="border-t border-gray-100 mb-3" />

            {/* Route */}
            <View className="gap-2">
                {/* Pickup */}
                <View className="flex-row items-start gap-2">
                    <View className="w-3.5 h-3.5 rounded-full border-2 border-[#01656c] mt-0.5" />
                    <View className="flex-1">
                        <Text className="text-xs text-gray-blue">Pickup</Text>
                        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                            {item.route.pickup.shortName || item.route.pickup.address}
                        </Text>
                    </View>
                </View>

                {/* Connector */}
                <View className="ml-[5px] w-px h-3 bg-gray-200 self-start" />

                {/* Dropoff */}
                <View className="flex-row items-start gap-2">
                    <Ionicons name="location" size={14} color="#ef4444" style={{ marginTop: 1 }} />
                    <View className="flex-1">
                        <Text className="text-xs text-gray-blue">Drop off</Text>
                        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                            {item.route.dropoff.shortName || item.route.dropoff.address}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Footer: date + fee */}
            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <Text className="text-xs text-gray-blue">{formatDate(item.createdAt)}</Text>
                <Text className="text-sm font-walsheim-bold text-foreground">
                    {formatFee(item.pricing.fee)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
    return (
        <View className="flex-1 items-center justify-center py-20 gap-3">
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center">
                <Ionicons name="cube-outline" size={32} color="#9ca3af" />
            </View>
            <Text className="text-base font-walsheim-bold text-foreground mt-2">
                {filtered ? "No deliveries here" : "No deliveries yet"}
            </Text>
            <Text className="text-sm text-gray-blue text-center px-8">
                {filtered
                    ? "Try a different filter to see more results."
                    : "Your delivery history will appear here once you make your first order."}
            </Text>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

    const fetchDeliveries = useCallback(async () => {
        try {
            const params = activeTab === "ALL" ? {} : { status: activeTab };
            const data = await deliveryService.getMyDeliveries(params);
            setDeliveries(data.deliveries ?? []);
        } catch {
            setDeliveries([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        setLoading(true);
        fetchDeliveries();
    }, [fetchDeliveries]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDeliveries();
        setRefreshing(false);
    }, [fetchDeliveries]);

    const handleTabChange = (tab: FilterTab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />

            {/* Header */}
            <View className="px-5 pt-4 pb-3">
                <Text className="text-2xl font-walsheim-bold text-foreground">
                    History
                </Text>
                <Text className="text-sm text-gray-blue mt-1">
                    All your delivery orders
                </Text>
            </View>

            {/* Filter tabs */}
            <View className="border-b border-gray-100">
                <FlatList
                    data={FILTER_TABS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(t) => t.key}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: 8 }}
                    renderItem={({ item: tab }) => {
                        const active = tab.key === activeTab;
                        return (
                            <TouchableOpacity
                                onPress={() => handleTabChange(tab.key)}
                                className="px-4 py-2 rounded-full"
                                style={{
                                    backgroundColor: active ? "#022401" : "#f3f4f6",
                                }}
                            >
                                <Text
                                    className="text-sm font-semibold"
                                    style={{ color: active ? "#ffffff" : "#6b7280" }}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#01656c" size="large" />
                </View>
            ) : (
                <FlatList
                    data={deliveries}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        paddingTop: 16,
                        paddingBottom: insets.bottom + 80,
                        flexGrow: 1,
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={<EmptyState filtered={activeTab !== "ALL"} />}
                    renderItem={({ item }) => (
                        <DeliveryCard
                            item={item}
                            onPress={() => router.push(`/delivery/${item.id}` as any)}
                        />
                    )}
                />
            )}
        </View>
    );
}
