import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDeliveryStore } from "../store/useDeliveryStore";

export default function DeliveryConfirmedScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { delivery, rider, resetDelivery } = useDeliveryStore();

    const handleDone = () => {
        resetDelivery();
        router.replace("/(tabs)" as any);
    };

    return (
        <View style={[st.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" />

            <View style={st.content}>
                {/* Success Icon */}
                <View style={st.successCircle}>
                    <Ionicons name="checkmark" size={44} color="#fff" />
                </View>
                <Text style={st.title}>Rider Confirmed!</Text>
                <Text style={st.sub}>
                    A rider has accepted your delivery request
                </Text>

                {/* Rider Card */}
                {rider && (
                    <View style={st.riderCard}>
                        <View style={st.riderHeader}>
                            {rider.profileImageUrl ? (
                                <Image
                                    source={{ uri: rider.profileImageUrl }}
                                    style={st.avatar}
                                />
                            ) : (
                                <View style={st.avatarPlaceholder}>
                                    <Text style={st.avatarText}>
                                        {rider.firstName?.charAt(0)}
                                        {rider.lastName?.charAt(0)}
                                    </Text>
                                </View>
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={st.riderName}>
                                    {rider.fullName}
                                </Text>
                                <View style={st.statusRow}>
                                    <View
                                        style={[
                                            st.statusDot,
                                            rider.riderStatus === "active" &&
                                                st.statusActive,
                                        ]}
                                    />
                                    <Text style={st.statusText}>
                                        {rider.riderStatus === "active"
                                            ? "Available"
                                            : rider.riderStatus}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={st.callBtn}>
                                <Ionicons
                                    name="call-outline"
                                    size={20}
                                    color="#022401"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Vehicle Info */}
                        {rider.vehicle && (
                            <>
                                <View style={st.divider} />
                                <View style={st.vehicleSection}>
                                    <Ionicons
                                        name="bicycle-outline"
                                        size={18}
                                        color="#6b7280"
                                    />
                                    <Text style={st.vehicleText}>
                                        {rider.vehicle.color}{" "}
                                        {rider.vehicle.brand}{" "}
                                        {rider.vehicle.model}
                                    </Text>
                                    <View style={st.plateBadge}>
                                        <Text style={st.plateText}>
                                            {rider.vehicle.licensePlate}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                )}

                {/* Tracking Summary */}
                {delivery && delivery.route && (
                    <View style={st.trackCard}>
                        <Text style={st.trackTitle}>Tracking Summary</Text>
                        <InfoRow
                            icon="pricetag-outline"
                            ic="#01656c"
                            label="Tracking ID"
                            value={delivery.trackingId}
                        />
                        <View style={st.sep} />
                        <InfoRow
                            icon="radio-button-on-outline"
                            ic="#f59e0b"
                            label="Pickup"
                            value={
                                delivery.route.pickup?.shortName || "Loading..."
                            }
                        />
                        <InfoRow
                            icon="location-outline"
                            ic="#ef4444"
                            label="Dropoff"
                            value={
                                delivery.route.dropoff?.shortName ||
                                "Loading..."
                            }
                        />
                        <View style={st.sep} />
                        <InfoRow
                            icon="cash-outline"
                            ic="#10b981"
                            label="Total"
                            value={`₦${delivery.pricing?.fee?.toLocaleString() || "0"}`}
                            bold
                        />
                    </View>
                )}
            </View>

            {/* Bottom CTA */}
            <View style={[st.bottom, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={st.doneBtn}
                    onPress={handleDone}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="home-outline"
                        size={20}
                        color="#fff"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={st.doneBtnText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function InfoRow({
    icon,
    ic,
    label,
    value,
    bold,
}: {
    icon: any;
    ic: string;
    label: string;
    value: string;
    bold?: boolean;
}) {
    return (
        <View style={st.infoRow}>
            <Ionicons name={icon} size={14} color={ic} />
            <Text style={st.infoKey}>{label}</Text>
            <Text style={bold ? st.infoValBold : st.infoVal} numberOfLines={1}>
                {value}
            </Text>
        </View>
    );
}

const st = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    content: {
        flex: 1,
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 24,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#10b981",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#1f2937",
        marginBottom: 6,
    },
    sub: {
        fontSize: 14,
        fontFamily: "GTWalsheimPro",
        color: "#6b7280",
        marginBottom: 28,
        textAlign: "center",
    },
    // Rider card
    riderCard: {
        width: "100%",
        backgroundColor: "#f9fafb",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 16,
    },
    riderHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#e5e7eb",
    },
    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#bbcf8d",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 18,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#fff",
    },
    riderName: {
        fontSize: 17,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#1f2937",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 3,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#9ca3af",
    },
    statusActive: { backgroundColor: "#10b981" },
    statusText: { fontSize: 12, fontFamily: "GTWalsheimPro", color: "#6b7280" },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#f0fdf4",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#bbf7d0",
    },
    divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 14 },
    vehicleSection: { flexDirection: "row", alignItems: "center", gap: 8 },
    vehicleText: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro-Medium",
        color: "#374151",
        flex: 1,
    },
    plateBadge: {
        backgroundColor: "#e5e7eb",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    plateText: {
        fontSize: 12,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#374151",
    },
    // Tracking card
    trackCard: {
        width: "100%",
        backgroundColor: "#f9fafb",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    trackTitle: {
        fontSize: 15,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#1f2937",
        marginBottom: 14,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 6,
    },
    infoKey: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro",
        color: "#6b7280",
        flex: 1,
    },
    infoVal: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro-Medium",
        color: "#374151",
        textAlign: "right",
        maxWidth: "50%",
    },
    infoValBold: {
        fontSize: 15,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#022401",
        textAlign: "right",
    },
    sep: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 },
    // Bottom
    bottom: {
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
    },
    doneBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#022401",
        borderRadius: 16,
        paddingVertical: 18,
    },
    doneBtnText: {
        fontSize: 16,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#fff",
    },
});
