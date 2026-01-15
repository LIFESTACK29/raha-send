import React, { useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RecentActivityItem = ({
    item,
    onPress,
}: {
    item: any;
    onPress?: () => void;
}) => {
    // 1. Setup the Animation value
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Delivered":
                return { container: "bg-[#E7F6ED]", text: "text-[#2D8A4E]" };
            case "Ongoing":
                return { container: "bg-[#FFEFD2]", text: "text-[#B08300]" };
            case "Cancelled":
                return { container: "bg-red-100", text: "text-red-600" };
            default:
                return { container: "bg-gray-100", text: "text-gray-600" };
        }
    };

    const statusStyle = getStatusStyles(item.status);

    // 2. Define the Press Animations
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96, // Slight shrink
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1, // Back to normal
            useNativeDriver: true,
            friction: 3,
            tension: 40,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                className="bg-white rounded-3xl p-4 mb-4 flex-row items-center justify-between"
                style={[
                    styles.cardShadow,
                    { transform: [{ scale: scaleAnim }] }, // 3. Apply the scale animation
                ]}
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                        <Ionicons
                            name={
                                item.type === "send"
                                    ? "paper-plane-outline"
                                    : "bicycle-outline"
                            }
                            size={22}
                            color="#1A2F1A"
                        />
                    </View>

                    <View className="ml-3 flex-1">
                        <Text
                            className="text-[#1A2F1A] font-bold text-base tracking-tight"
                            numberOfLines={1}
                        >
                            {item.location}
                        </Text>
                        <Text className="text-gray-400 text-xs mt-1">
                            {item.timestamp}
                        </Text>
                    </View>
                </View>

                <View className="items-end">
                    <Text className="text-[#1A2F1A] font-bold text-lg mb-1">
                        {item.amount}
                    </Text>
                    <View
                        className={`px-3 py-1 rounded-full ${statusStyle.container}`}
                    >
                        <Text
                            className={`text-[10px] font-bold ${statusStyle.text}`}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        borderColor: "#D1D5DB80",
        borderWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
});

export default RecentActivityItem;
