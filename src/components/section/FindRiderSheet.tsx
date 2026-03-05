import { useEffect, useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withRepeat,
    withSequence,
    interpolate,
    Easing,
    cancelAnimation,
    Extrapolation,
} from "react-native-reanimated";
import {
    Phone,
    MessageCircle,
    Star,
    MapPin,
    Bike,
    Check,
} from "lucide-react-native";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { API_URL } from "@/src/const";
import { ablyClient } from "@/src/services/ably";
import GorhomBottomSheet from "@/src/components/misc/CustomBottomSheet";
import { useAtomValue } from "jotai";
import { deliveryRequestAtom } from "@/src/store/delivery";

interface FindRiderSheetProps {
    visible: boolean;
    onClose: () => void;
}

const FindRiderSheet = ({ visible, onClose }: FindRiderSheetProps) => {
    const { getToken, userId } = useAuth();
    const deliveryRequest = useAtomValue(deliveryRequestAtom);
    const [riderInfo, setRiderInfo] = useState<any>(null);

    const sheetState = useSharedValue(0); // 0=searching, 1=found, 2=confirmed
    const searchPulse = useSharedValue(1);
    const dotProgress = useSharedValue(0);
    const checkScale = useSharedValue(0);

    // Searching pulse animation
    const startSearchAnimation = useCallback(() => {
        searchPulse.value = withRepeat(
            withSequence(
                withTiming(1.15, {
                    duration: 800,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                }),
                withTiming(1, {
                    duration: 800,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                }),
            ),
            -1,
            true,
        );

        dotProgress.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false,
        );
    }, []);

    // Transition to found state
    const transitionToFound = useCallback(() => {
        cancelAnimation(searchPulse);
        searchPulse.value = withSpring(1);
        sheetState.value = withTiming(1, {
            duration: 400,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
    }, []);

    // Transition to confirmed
    const transitionToConfirmed = useCallback(() => {
        sheetState.value = withTiming(2, {
            duration: 300,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        checkScale.value = withSpring(1, { damping: 8, stiffness: 180 });
    }, []);

    const closeSheet = useCallback(() => {
        cancelAnimation(searchPulse);
        cancelAnimation(dotProgress);
        onClose();
    }, [onClose]);

    // Open / close sheet and make request
    useEffect(() => {
        let channel: any;

        const initiateRequest = async () => {
            if (!userId) return;

            try {
                const token = await getToken();

                // Subscribe to Ably channel
                channel = ablyClient.channels.get(`customer-${userId}`);
                channel.subscribe("delivery_accepted", (message: any) => {
                    console.log("Delivery accepted!", message.data);
                    setRiderInfo(message.data.rider);
                    transitionToFound();

                    setTimeout(() => {
                        transitionToConfirmed();
                    }, 2500);
                });

                // Request delivery using global states
                await axios.post(
                    `${API_URL}/deliveries/request`,
                    deliveryRequest,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
            } catch (error) {
                console.error("Failed to request delivery", error);
            }
        };

        if (visible) {
            sheetState.value = 0;
            checkScale.value = 0;
            setRiderInfo(null);
            startSearchAnimation();

            initiateRequest();

            return () => {
                if (channel) {
                    channel.unsubscribe();
                }
            };
        } else {
            closeSheet();
        }
    }, [visible, userId]);

    // Animated styles
    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: searchPulse.value }],
        opacity: interpolate(sheetState.value, [0, 0.5, 1], [1, 0.5, 0]),
    }));

    const searchingContentStyle = useAnimatedStyle(() => ({
        opacity: interpolate(sheetState.value, [0, 0.5], [1, 0]),
        transform: [
            {
                translateY: interpolate(sheetState.value, [0, 1], [0, -20]),
            },
        ],
        position: "absolute" as const,
        width: "100%" as const,
    }));

    const foundContentStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            sheetState.value,
            [0.5, 1],
            [0, 1],
            Extrapolation.CLAMP,
        ),
        transform: [
            {
                translateY: interpolate(
                    sheetState.value,
                    [0.5, 1],
                    [30, 0],
                    Extrapolation.CLAMP,
                ),
            },
        ],
    }));

    const confirmBadgeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
        opacity: checkScale.value,
    }));

    // Animated dots
    const dot1Style = useAnimatedStyle(() => ({
        opacity: interpolate(
            dotProgress.value,
            [0, 0.33, 0.66, 1],
            [0.3, 1, 0.3, 0.3],
        ),
    }));
    const dot2Style = useAnimatedStyle(() => ({
        opacity: interpolate(
            dotProgress.value,
            [0, 0.33, 0.66, 1],
            [0.3, 0.3, 1, 0.3],
        ),
    }));
    const dot3Style = useAnimatedStyle(() => ({
        opacity: interpolate(
            dotProgress.value,
            [0, 0.33, 0.66, 1],
            [0.3, 0.3, 0.3, 1],
        ),
    }));

    return (
        <GorhomBottomSheet
            visible={visible}
            onClose={closeSheet}
            snapPoints={["37%", "45%"]}
            backgroundColor="#F4F4F0"
        >
            <View className="flex-1 px-5 flex flex-row justify-center mt-2">
                {/* SEARCHING STATE */}
                <Animated.View
                    style={searchingContentStyle}
                    className="items-center pt-8 w-full"
                >
                    {/* Pulse circle */}
                    <Animated.View style={pulseStyle}>
                        <View className="w-24 h-24 rounded-full bg-foreground/10 items-center justify-center">
                            <View className="w-16 h-16 rounded-full bg-foreground/20 items-center justify-center">
                                <Bike
                                    size={28}
                                    color="#022401"
                                    strokeWidth={1.5}
                                />
                            </View>
                        </View>
                    </Animated.View>

                    <View className="flex-row items-center mt-6">
                        <Text className="text-foreground text-lg font-medium tracking-tight">
                            Finding your rider
                        </Text>
                        <View className="flex-row ml-1 gap-0.5">
                            <Animated.Text
                                style={dot1Style}
                                className="text-foreground text-lg"
                            >
                                .
                            </Animated.Text>
                            <Animated.Text
                                style={dot2Style}
                                className="text-foreground text-lg"
                            >
                                .
                            </Animated.Text>
                            <Animated.Text
                                style={dot3Style}
                                className="text-foreground text-lg"
                            >
                                .
                            </Animated.Text>
                        </View>
                    </View>

                    <Text className="text-gray-400 text-sm mt-2 tracking-tight text-center">
                        Hang tight! We're matching you with the best rider
                        nearby.
                    </Text>
                </Animated.View>

                {/* FOUND / CONFIRMED STATE */}
                <Animated.View style={foundContentStyle} className="w-full">
                    {/* Rider Card */}
                    <View
                        style={styles.cardShadow}
                        className="bg-white rounded-3xl p-3 mt-2"
                    >
                        <View className="flex-row items-center">
                            {/* Avatar */}
                            <View className="relative">
                                <View className="w-14 h-14 rounded-full bg-foreground items-center justify-center overflow-hidden">
                                    {riderInfo?.imageUrl ? (
                                        <Image
                                            source={{ uri: riderInfo.imageUrl }}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <Text className="text-white text-lg font-bold">
                                            {riderInfo?.name
                                                ? riderInfo.name
                                                      .substring(0, 2)
                                                      .toUpperCase()
                                                : "AO"}
                                        </Text>
                                    )}
                                </View>
                                {/* Confirmed badge */}
                                <Animated.View
                                    style={[
                                        confirmBadgeStyle,
                                        styles.confirmBadge,
                                    ]}
                                >
                                    <Check
                                        size={10}
                                        color="#fff"
                                        strokeWidth={3}
                                    />
                                </Animated.View>
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="text-foreground text-base font-semibold tracking-tight">
                                    {riderInfo?.name || "Adamu Okonkwo"}
                                </Text>
                                <View className="flex-row items-center mt-0.5 gap-1">
                                    <Star
                                        size={12}
                                        color="#F59E0B"
                                        fill="#F59E0B"
                                    />
                                    <Text className="text-gray-500 text-xs tracking-tight">
                                        {riderInfo?.rating || "4.9"} •{" "}
                                        {riderInfo?.deliveries || "342"}{" "}
                                        deliveries
                                    </Text>
                                </View>
                            </View>

                            {/* Rider status */}
                            <View className="bg-[#E7F6ED] px-3 py-1.5 rounded-full">
                                <Text className="text-[#2D8A4E] text-[10px] font-bold tracking-tight">
                                    Matched
                                </Text>
                            </View>
                        </View>

                        {/* Vehicle info */}
                        <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
                            <Bike size={16} color="#9CA3AF" strokeWidth={1.5} />
                            <Text className="text-gray-500 text-xs ml-2 tracking-tight">
                                {riderInfo?.vehicle || "Honda ACE 125 • Black"}
                            </Text>
                            <View className="ml-auto flex-row items-center">
                                <MapPin
                                    size={12}
                                    color="#9CA3AF"
                                    strokeWidth={1.5}
                                />
                                <Text className="text-gray-500 text-xs ml-1 tracking-tight">
                                    3 min away
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ETA */}
                    <View className="flex-row items-center justify-between px-2 mt-4">
                        <Text className="text-gray-400 text-sm tracking-tight">
                            Estimated pickup
                        </Text>
                        <Text className="text-foreground text-sm font-semibold tracking-tight">
                            3-5 minutes
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3 mt-5">
                        <Pressable
                            className="flex-1 h-14 bg-white rounded-2xl flex-row items-center justify-center gap-2"
                            style={styles.actionBtn}
                        >
                            <Phone
                                size={18}
                                color="#022401"
                                strokeWidth={1.5}
                            />
                            <Text className="text-foreground text-sm font-medium tracking-tight">
                                Call
                            </Text>
                        </Pressable>
                        <Pressable
                            className="flex-1 h-14 bg-white rounded-2xl flex-row items-center justify-center gap-2"
                            style={styles.actionBtn}
                        >
                            <MessageCircle
                                size={18}
                                color="#022401"
                                strokeWidth={1.5}
                            />
                            <Text className="text-foreground text-sm font-medium tracking-tight">
                                Message
                            </Text>
                        </Pressable>
                    </View>

                    {/* Cancel */}
                    <Pressable
                        className="mt-4 h-12 items-center justify-center"
                        onPress={closeSheet}
                    >
                        <Text className="text-red-400 text-sm font-medium tracking-tight">
                            Cancel Request
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>
        </GorhomBottomSheet>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        borderColor: "#D1D5DB40",
        borderWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    confirmBadge: {
        position: "absolute",
        bottom: 0,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#2D8A4E",
        borderWidth: 2,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    actionBtn: {
        borderColor: "#D1D5DB60",
        borderWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
    },
});

export default FindRiderSheet;
