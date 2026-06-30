import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deliveryService } from "@/src/features/delivery/services/delivery.api";
import { Delivery } from "@/src/features/delivery/types/delivery.types";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    string,
    { label: string; bg: string; text: string; icon: string }
> = {
    PENDING:   { label: "Pending",   bg: "#fef9c3", text: "#854d0e", icon: "time-outline" },
    ONGOING:   { label: "Active",    bg: "#dbeafe", text: "#1e40af", icon: "bicycle-outline" },
    DELIVERED: { label: "Delivered", bg: "#dcfce7", text: "#166534", icon: "checkmark-circle-outline" },
    CANCELLED: { label: "Cancelled", bg: "#fee2e2", text: "#991b1b", icon: "close-circle-outline" },
};

const PACKAGE_ICONS: Record<string, string> = {
    DOCUMENT:    "document-text-outline",
    PARCEL:      "cube-outline",
    FRAGILE:     "warning-outline",
    FOOD:        "fast-food-outline",
    ELECTRONICS: "hardware-chip-outline",
    OTHER:       "bag-handle-outline",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const formatFee = (fee: number) => `₦${fee.toLocaleString()}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
            {children}
        </View>
    );
}

function SectionLabel({ text }: { text: string }) {
    return (
        <Text className="text-xs font-semibold text-gray-blue uppercase tracking-wide mb-3">
            {text}
        </Text>
    );
}

function InfoRow({
    label,
    value,
    valueClass,
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <View className="flex-row justify-between items-start py-2 border-b border-gray-50 last:border-0">
            <Text className="text-sm text-gray-blue flex-1">{label}</Text>
            <Text
                className={`text-sm font-semibold text-foreground flex-1 text-right ${valueClass ?? ""}`}
                numberOfLines={2}
            >
                {value}
            </Text>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DeliveryDetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await deliveryService.getDeliveryById(id);
            setDelivery(data.delivery);
        } catch (e: any) {
            setError(
                e?.response?.data?.message ?? "Failed to load delivery details."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center" style={{ paddingTop: insets.top }}>
                <StatusBar style="dark" />
                <ActivityIndicator color="#01656c" size="large" />
            </View>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error || !delivery) {
        return (
            <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
                <StatusBar style="dark" />
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="px-5 pt-4 pb-2 flex-row items-center gap-2"
                >
                    <Ionicons name="arrow-back" size={22} color="#022401" />
                    <Text className="text-base font-walsheim-bold text-foreground">Back</Text>
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center px-8 gap-3">
                    <Ionicons name="alert-circle-outline" size={48} color="#d1d5db" />
                    <Text className="text-base font-walsheim-bold text-foreground text-center">
                        {error ?? "Delivery not found"}
                    </Text>
                    <TouchableOpacity
                        onPress={load}
                        className="mt-2 px-6 py-3 rounded-xl bg-[#022401]"
                    >
                        <Text className="text-white font-walsheim-bold">Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // ── Resolved ─────────────────────────────────────────────────────────────
    const cfg = STATUS_CONFIG[delivery.status] ?? STATUS_CONFIG.PENDING;
    const pkgIcon = PACKAGE_ICONS[delivery.package.type] ?? "cube-outline";

    return (
        <View className="flex-1 bg-[#f8f9fa]" style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />

            {/* Header */}
            <View className="bg-white px-5 pt-4 pb-4 flex-row items-center gap-3 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={20} color="#022401" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-xs text-gray-blue">Delivery Details</Text>
                    <Text className="text-base font-walsheim-bold text-foreground" numberOfLines={1}>
                        {delivery.trackingId}
                    </Text>
                </View>
                <View
                    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: cfg.bg }}
                >
                    <Ionicons name={cfg.icon as any} size={13} color={cfg.text} />
                    <Text className="text-xs font-semibold" style={{ color: cfg.text }}>
                        {cfg.label}
                    </Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Route */}
                <SectionCard>
                    <SectionLabel text="Route" />

                    {/* Pickup */}
                    <View className="flex-row items-start gap-3 mb-3">
                        <View className="items-center gap-1 pt-0.5">
                            <View className="w-3 h-3 rounded-full border-2 border-[#01656c]" />
                            <View className="w-px flex-1 min-h-[28px] bg-gray-200" />
                        </View>
                        <View className="flex-1 pb-3">
                            <Text className="text-xs text-gray-blue mb-0.5">Pickup</Text>
                            <Text className="text-sm font-semibold text-foreground">
                                {delivery.route.pickup.address}
                            </Text>
                            {delivery.route.pickup.shortName ? (
                                <Text className="text-xs text-gray-blue mt-0.5">
                                    {delivery.route.pickup.shortName}
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    {/* Dropoff */}
                    <View className="flex-row items-start gap-3">
                        <View className="items-center pt-0.5">
                            <Ionicons name="location" size={14} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-gray-blue mb-0.5">Drop off</Text>
                            <Text className="text-sm font-semibold text-foreground">
                                {delivery.route.dropoff.address}
                            </Text>
                            {delivery.route.dropoff.shortName ? (
                                <Text className="text-xs text-gray-blue mt-0.5">
                                    {delivery.route.dropoff.shortName}
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    {/* Distance */}
                    {delivery.route.distanceKm > 0 && (
                        <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center gap-1.5">
                            <Ionicons name="navigate-outline" size={13} color="#6b7280" />
                            <Text className="text-xs text-gray-blue">
                                {delivery.route.distanceKm} km
                            </Text>
                        </View>
                    )}
                </SectionCard>

                {/* Recipient */}
                <SectionCard>
                    <SectionLabel text="Recipient" />
                    <InfoRow label="Name"  value={delivery.contact.receiver.fullName} />
                    <InfoRow label="Phone" value={delivery.contact.receiver.phoneNumber} />
                </SectionCard>

                {/* Sender */}
                <SectionCard>
                    <SectionLabel text="Sender" />
                    <InfoRow label="Name"  value={delivery.contact.customer.fullName} />
                    <InfoRow label="Phone" value={delivery.contact.customer.phoneNumber} />
                </SectionCard>

                {/* Package */}
                <SectionCard>
                    <SectionLabel text="Package" />
                    <View className="flex-row items-center gap-3 mb-3">
                        <View className="w-10 h-10 rounded-xl bg-[#e8f4f4] items-center justify-center">
                            <Ionicons name={pkgIcon as any} size={20} color="#01656c" />
                        </View>
                        <Text className="text-sm font-semibold text-foreground capitalize">
                            {delivery.package.type.charAt(0) + delivery.package.type.slice(1).toLowerCase()}
                        </Text>
                    </View>
                    {delivery.package.note ? (
                        <View className="bg-gray-50 rounded-xl p-3">
                            <Text className="text-xs text-gray-blue mb-0.5">Note</Text>
                            <Text className="text-sm text-foreground">{delivery.package.note}</Text>
                        </View>
                    ) : null}
                </SectionCard>

                {/* Rider */}
                {delivery.rider ? (
                    <SectionCard>
                        <SectionLabel text="Rider" />
                        <View className="flex-row items-center gap-3 mb-3">
                            <View className="w-10 h-10 rounded-full bg-[#bbcf8d] items-center justify-center">
                                <Ionicons name="person" size={20} color="#fff" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-foreground">
                                    {delivery.rider.fullName}
                                </Text>
                                <Text className="text-xs text-gray-blue">
                                    {delivery.rider.phoneNumber}
                                </Text>
                            </View>
                        </View>
                    </SectionCard>
                ) : null}

                {/* Pricing */}
                <SectionCard>
                    <SectionLabel text="Payment" />
                    <View className="flex-row justify-between items-center py-1">
                        <Text className="text-sm text-gray-blue">Delivery fee</Text>
                        <Text className="text-lg font-walsheim-bold text-foreground">
                            {formatFee(delivery.pricing.fee)}
                        </Text>
                    </View>
                </SectionCard>

                {/* Timestamps */}
                <SectionCard>
                    <SectionLabel text="Timeline" />
                    <InfoRow label="Ordered"   value={formatDate(delivery.createdAt)} />
                    {delivery.updatedAt && delivery.updatedAt !== delivery.createdAt ? (
                        <InfoRow label="Last updated" value={formatDate(delivery.updatedAt)} />
                    ) : null}
                </SectionCard>
            </ScrollView>
        </View>
    );
}
