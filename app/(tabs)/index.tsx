import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";
import { deliveryService } from "@/src/features/delivery/services/delivery.api";
import { Delivery } from "@/src/features/delivery/types/delivery.types";
import { WalletCard } from "@/src/components/WalletCard";
import { useWalletStore } from "@/src/store/useWalletStore";

const deliveryOptions = [
    {
        id: "instant",
        title: "Instant",
        subtitle: "Delivery",
        description: "Fast pickup,\ndelivered now",
        icon: "flash-outline",
        iconColor: "#ffffff",
        iconBg: "#01656c",
        bg: "#022401",
        textColor: "#ffffff",
        subtitleColor: "rgba(255,255,255,0.65)",
        borderColor: "transparent",
        available: true,
    },
    {
        id: "schedule",
        title: "Schedule",
        subtitle: "Delivery",
        description: "Pick a date\n& time",
        icon: "stopwatch-outline",
        iconColor: "#01656c",
        iconBg: "#e8f4f4",
        bg: "#ffffff",
        textColor: "#022401",
        subtitleColor: "#6b7280",
        borderColor: "#e5e7eb",
        available: false,
    },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    PENDING:   { label: "Pending",   bg: "#fef9c3", text: "#854d0e" },
    ONGOING:   { label: "Active",    bg: "#dbeafe", text: "#1e40af" },
    DELIVERED: { label: "Delivered", bg: "#dcfce7", text: "#166534" },
    CANCELLED: { label: "Cancelled", bg: "#fee2e2", text: "#991b1b" },
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatFee = (fee: number) => `₦${fee.toLocaleString()}`;

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuthStore();

    const { balance, accountPreview, hasWallet, fetchWalletStatus } = useWalletStore();

    const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecentDeliveries = useCallback(async () => {
        try {
            const data = await deliveryService.getMyDeliveries({ limit: 3 });
            setRecentDeliveries(data.deliveries ?? []);
        } catch {
            // silently ignore — empty state handles it
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecentDeliveries();
        fetchWalletStatus();
    }, [fetchRecentDeliveries, fetchWalletStatus]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([fetchRecentDeliveries(), fetchWalletStatus()]);
        setRefreshing(false);
    }, [fetchRecentDeliveries, fetchWalletStatus]);

    const firstName = user?.firstName ?? "there";
    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View
                    className="px-5 pb-4 flex-row items-center justify-between"
                    style={{ paddingTop: 16 }}
                >
                    <View>
                        <Text className="text-base text-gray-blue">
                            Welcome Back
                        </Text>
                        <Text className="text-3xl font-walsheim-bold text-foreground">
                            {firstName}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity className="relative">
                            <Ionicons
                                name="notifications-outline"
                                size={28}
                                color="#111"
                            />
                            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                        </TouchableOpacity>
                        <View className="w-11 h-11 rounded-full bg-[#bbcf8d] items-center justify-center">
                            <Text className="text-white text-lg font-bold">{initials}</Text>
                        </View>
                    </View>
                </View>

                {/* Wallet Card */}
                {hasWallet && (
                    <View className="px-5 mt-4">
                        <WalletCard
                            balance={balance}
                            accountPreview={accountPreview}
                            onTopUp={() => router.push("/(tabs)/wallet" as any)}
                        />
                    </View>
                )}

                {/* What would you like to do */}
                <View className="px-5 mt-4">
                    <Text className="text-lg font-walsheim-bold text-foreground mb-4 mt-2">
                        What would you like to do?
                    </Text>

                    <View className="flex-row gap-3">
                        {deliveryOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={option.available ? 0.8 : 1}
                                className="flex-1 rounded-2xl p-4 border overflow-hidden"
                                style={{
                                    backgroundColor: option.bg,
                                    borderColor: option.borderColor,
                                    opacity: option.available ? 1 : 0.72,
                                }}
                                onPress={() => {
                                    if (option.id === "instant") {
                                        router.push("/delivery/create" as any);
                                    }
                                }}
                            >
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center mb-4"
                                    style={{ backgroundColor: option.iconBg }}
                                >
                                    <Ionicons
                                        name={option.icon as any}
                                        size={20}
                                        color={option.iconColor}
                                    />
                                </View>
                                <Text
                                    className="text-[17px] font-walsheim-bold leading-tight"
                                    style={{ color: option.textColor }}
                                >
                                    {option.title}
                                </Text>
                                <Text
                                    className="text-[17px] font-walsheim-bold leading-tight mb-3"
                                    style={{ color: option.textColor }}
                                >
                                    {option.subtitle}
                                </Text>
                                <Text
                                    className="text-[12px] leading-[17px]"
                                    style={{ color: option.subtitleColor }}
                                >
                                    {option.description}
                                </Text>
                                <View className="mt-5 flex-row items-center justify-between">
                                    {option.available ? (
                                        <View
                                            className="w-8 h-8 rounded-full items-center justify-center"
                                            style={{ backgroundColor: option.iconBg }}
                                        >
                                            <Ionicons
                                                name="arrow-forward"
                                                size={16}
                                                color={option.iconColor}
                                            />
                                        </View>
                                    ) : (
                                        <View
                                            className="px-2 py-1 rounded-full"
                                            style={{ backgroundColor: "#f3f4f6" }}
                                        >
                                            <Text className="text-[10px] font-semibold text-gray-400">
                                                Coming soon
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* History Section */}
                <View className="px-5 mt-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-walsheim-bold text-foreground">
                            Recent Deliveries
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/(tabs)/history" as any)}>
                            <Text className="text-sm text-teal-700 font-semibold">
                                View all
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {historyLoading ? (
                        <View className="py-8 items-center">
                            <ActivityIndicator color="#01656c" />
                        </View>
                    ) : recentDeliveries.length === 0 ? (
                        <View className="py-10 items-center gap-2">
                            <Ionicons name="cube-outline" size={40} color="#d1d5db" />
                            <Text className="text-sm text-gray-400 font-walsheim mt-2">
                                No deliveries yet
                            </Text>
                        </View>
                    ) : (
                        <View className="gap-4">
                            {recentDeliveries.map((item) => {
                                const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        className="border border-gray-100 rounded-2xl p-4"
                                        activeOpacity={0.75}
                                        onPress={() =>
                                            router.push(`/delivery/${item.id}` as any)
                                        }
                                    >
                                        {/* Tracking ID + Status */}
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Text className="text-sm font-walsheim-bold text-foreground">
                                                {item.trackingId}
                                            </Text>
                                            <View
                                                className="px-3 py-1 rounded-full"
                                                style={{ backgroundColor: cfg.bg }}
                                            >
                                                <Text
                                                    className="text-xs font-semibold"
                                                    style={{ color: cfg.text }}
                                                >
                                                    {cfg.label}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Recipient */}
                                        <Text className="text-xs text-gray-blue mb-3">
                                            Recipient: {item.contact.receiver.fullName}
                                        </Text>

                                        <View className="border-t border-gray-100 mb-3" />

                                        {/* Drop-off info */}
                                        <View className="flex-row items-start gap-2">
                                            <Ionicons
                                                name="location-outline"
                                                size={14}
                                                color="#00A86B"
                                                style={{ marginTop: 1 }}
                                            />
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-blue">
                                                    Drop off
                                                </Text>
                                                <Text className="text-sm font-semibold text-foreground">
                                                    {item.route.dropoff.address}
                                                </Text>
                                                <View className="flex-row justify-between items-center mt-0.5">
                                                    <Text className="text-xs text-gray-blue">
                                                        {formatDate(item.createdAt)}
                                                    </Text>
                                                    <Text className="text-xs font-walsheim-bold text-foreground">
                                                        {formatFee(item.pricing.fee)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
