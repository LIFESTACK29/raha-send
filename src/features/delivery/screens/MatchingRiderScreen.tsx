import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NoRiderFoundSheet } from "../components/NoRiderFoundSheet";
import {
    connectDeliverySocket,
    disconnectDeliverySocket,
    onDeliveryAccepted,
    onNoRiderFound,
} from "../services/delivery.socket";
import { useDeliveryStore } from "../store/useDeliveryStore";

const { width } = Dimensions.get("window");

export default function MatchingRiderScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const {
        matchRequest,
        setRider,
        matchingState,
        setMatchingState,
        noRiderPayload,
        setNoRiderPayload,
        waitMore,
        createManual,
        resetDelivery,
    } = useDeliveryStore();

    const [pulseAnim] = useState(new Animated.Value(1));
    const [rotateAnim] = useState(new Animated.Value(0));

    // Handle socket connections and matching events
    useEffect(() => {
        if (!matchRequest) {
            router.replace("/delivery/create" as any);
            return;
        }

        const setupSocket = async () => {
            try {
                const socket = await connectDeliverySocket();

                onDeliveryAccepted((payload) => {
                    console.log(
                        "[Socket] Delivery Accepted:",
                        payload.delivery.trackingId,
                    );
                    setRider(payload.rider);
                    // Store actual delivery in state
                    useDeliveryStore.setState({ delivery: payload.delivery });
                    router.replace("/delivery/confirmed" as any);
                });

                onNoRiderFound((payload) => {
                    console.log("[Socket] No Rider Found:", payload.message);
                    setNoRiderPayload(payload);
                });
            } catch (err) {
                console.error("Socket connection failed:", err);
            }
        };

        setupSocket();

        return () => {
            disconnectDeliverySocket();
        };
    }, [matchRequest]);

    // Animations
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
            ]),
        ).start();

        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    if (!matchRequest) return null;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Animated Background Rings */}
            <View style={styles.animationContainer}>
                <Animated.View
                    style={[
                        styles.ring,
                        { transform: [{ scale: pulseAnim }], opacity: 0.15 },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.ring,
                        {
                            transform: [
                                { scale: Animated.multiply(pulseAnim, 0.7) },
                            ],
                            opacity: 0.3,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.centralIcon,
                        { transform: [{ rotate: spin }] },
                    ]}
                >
                    <View style={styles.iconCircle}>
                        <Ionicons name="bicycle" size={40} color="#ffffff" />
                    </View>
                </Animated.View>
            </View>

            {/* Header Info */}
            <View
                style={[styles.content, { paddingBottom: insets.bottom + 40 }]}
            >
                <Text style={styles.title}>Finding a Rider</Text>
                <Text style={styles.subtitle}>
                    We're notifying riders near your pickup location...
                </Text>

                {/* Request Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.locIndicator}>
                            <View
                                style={[
                                    styles.dot,
                                    { backgroundColor: "#f59e0b" },
                                ]}
                            />
                            <View style={styles.line} />
                            <View
                                style={[
                                    styles.dot,
                                    { backgroundColor: "#ef4444" },
                                ]}
                            />
                        </View>
                        <View style={styles.locTextContainer}>
                            <Text style={styles.locText} numberOfLines={1}>
                                {matchRequest.route.pickup.shortName}
                            </Text>
                            <Text style={styles.locText} numberOfLines={1}>
                                {matchRequest.route.dropoff.shortName}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Total</Text>
                        <Text style={styles.feeValue}>
                            ₦{matchRequest.pricing.fee.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                        resetDelivery();
                        router.replace("/(tabs)" as any);
                    }}
                >
                    <Text style={styles.cancelText}>Cancel Request</Text>
                </TouchableOpacity>
            </View>

            {/* No Rider Found Bottom Sheet */}
            <NoRiderFoundSheet
                visible={matchingState === "no_rider_found"}
                payload={noRiderPayload}
                onKeepWaiting={() => waitMore()}
                onCreateYourself={async () => {
                    await createManual();
                    router.replace("/delivery/manual-pending" as any);
                }}
                onClose={() => {
                    resetDelivery();
                    router.replace("/(tabs)" as any);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#022401",
        alignItems: "center",
        justifyContent: "space-between",
    },
    animationContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60,
    },
    ring: {
        position: "absolute",
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        borderWidth: 2,
        borderColor: "#ffffff",
    },
    centralIcon: {
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    content: {
        width: "100%",
        paddingHorizontal: 24,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#ffffff",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: "GTWalsheimPro",
        color: "rgba(255,255,255,0.7)",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 22,
    },
    summaryCard: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: "row",
        gap: 16,
    },
    locIndicator: {
        alignItems: "center",
        gap: 4,
        paddingTop: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    line: {
        width: 2,
        height: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    locTextContainer: {
        flex: 1,
        gap: 12,
    },
    locText: {
        fontSize: 15,
        fontFamily: "GTWalsheimPro-Medium",
        color: "#ffffff",
    },
    summaryDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginVertical: 16,
    },
    feeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    feeItem: {
        gap: 4,
    },
    feeLabel: {
        fontSize: 12,
        fontFamily: "GTWalsheimPro",
        color: "rgba(255,255,255,0.5)",
    },
    feeValue: {
        fontSize: 16,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#ffffff",
    },
    cancelBtn: {
        paddingVertical: 12,
    },
    cancelText: {
        fontSize: 15,
        fontFamily: "GTWalsheimPro-Medium",
        color: "rgba(255,255,255,0.5)",
    },
});
