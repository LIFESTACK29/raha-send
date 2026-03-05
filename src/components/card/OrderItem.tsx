import React, { useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Order } from "@/src/data/orders";

const OrderItem = ({
    item,
    onPress,
}: {
    item: Order;
    onPress?: () => void;
}) => {
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

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
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
                className="bg-white rounded-3xl p-4 mb-4"
                style={[
                    styles.cardShadow,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                {/* Top row: Tracking ID + Status */}
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-gray-400 text-xs font-medium tracking-tight">
                        {item.trackingId}
                    </Text>
                    <View
                        className={`px-3 py-1.5 rounded-full ${statusStyle.container}`}
                    >
                        <Text
                            className={`text-[10px] font-bold tracking-tight ${statusStyle.text}`}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                {/* Route */}
                <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                        <Ionicons
                            name="paper-plane-outline"
                            size={18}
                            color="#1A2F1A"
                        />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text
                            className="text-[#1A2F1A] font-semibold text-base tracking-tight"
                            numberOfLines={1}
                        >
                            {item.from} → {item.to}
                        </Text>
                        <Text className="text-gray-400 text-[11px] mt-0.5">
                            {item.packageType}
                        </Text>
                    </View>
                </View>

                {/* Bottom row: Date + Amount */}
                <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                    <Text className="text-gray-400 text-[11px] tracking-tight">
                        {item.date}
                    </Text>
                    <Text className="text-[#1A2F1A] font-bold text-[14px] tracking-tight leading-6">
                        {item.amount}
                    </Text>
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

export default OrderItem;
