import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const deliveryOptions = [
    {
        id: "instant",
        title: "Instant Delivery",
        description: "Courier takes only your package and delivers instantly",
        icon: "flash-outline",
        iconColor: "#01656c",
        bg: "#bbcf8d",
        watermarkColor: "rgba(1, 101, 108, 0.12)",
        borderColor: "transparent",
    },
    {
        id: "schedule",
        title: "Schedule Delivery",
        description: "Courier comes to pick up on your specified date and time",
        icon: "stopwatch-outline",
        iconColor: "#01656c",
        bg: "#ffffff",
        watermarkColor: "#f4f4f4",
        borderColor: "#e5e7eb",
    },
];

const historyData = [
    {
        id: "ORD81234",
        recipient: "Paul Pogba",
        dropOff: "Maryland bustop, Anthony Ikeja",
        date: "12 January 2020, 2:43pm",
        status: "Completed",
    },
    {
        id: "ORD81234",
        recipient: "Paul Pogba",
        dropOff: "Maryland bustop, Anthony Ikeja",
        date: "12 January 2020, 2:43pm",
        status: "Completed",
    },
];

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: insets.bottom + 80,
                }}
                showsVerticalScrollIndicator={false}
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
                            Davidson Edgar
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        {/* Notification Bell */}
                        <TouchableOpacity className="relative">
                            <Ionicons
                                name="notifications-outline"
                                size={28}
                                color="#111"
                            />
                            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                        </TouchableOpacity>
                        {/* Avatar */}
                        <View className="w-11 h-11 rounded-full bg-[#bbcf8d] items-center justify-center">
                            <Text className="text-white text-lg font-bold">
                                DE
                            </Text>
                        </View>
                    </View>
                </View>

                {/* What would you like to do */}
                <View className="px-5 mt-4">
                    <Text className="text-lg font-walsheim-bold text-foreground mb-4 mt-2">
                        What would you like to do?
                    </Text>

                    {/* Delivery Option Cards */}
                    <View className="gap-4">
                        {deliveryOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.85}
                                className="rounded-xl p-6 overflow-hidden relative border"
                                style={{
                                    backgroundColor: option.bg,
                                    borderColor: option.borderColor,
                                }}
                                onPress={() => {
                                    if (option.id === "instant") {
                                        router.push("/delivery/create" as any);
                                    }
                                }}
                            >
                                {/* Background Watermark */}
                                <Ionicons
                                    name={option.icon as any}
                                    size={option.id === "schedule" ? 240 : 200}
                                    color={option.watermarkColor}
                                    style={{
                                        position: "absolute",
                                        right: option.id === "schedule" ? -90 : -20,
                                        top: option.id === "schedule" ? -30 : -40,
                                        transform: option.id === "instant" ? [{ rotate: "15deg" }] : [],
                                    }}
                                />

                                {/* Icon */}
                                <View className="mb-3">
                                    <Ionicons
                                        name={option.icon as any}
                                        size={34}
                                        color={option.iconColor}
                                    />
                                </View>
                                
                                <Text className="text-[22px] font-walsheim-bold text-black my-3">
                                    {option.title}
                                </Text>
                                <Text className="text-[14px] text-[#4a4a4a] leading-5 pr-8">
                                    {option.description}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* History Section */}
                <View className="px-5 mt-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-walsheim-bold text-foreground">
                            History
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-sm text-teal-700 font-semibold">
                                View all
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* History Cards */}
                    <View className="gap-4">
                        {historyData.map((item, index) => (
                            <View
                                key={index}
                                className="border border-gray-100 rounded-2xl p-4"
                            >
                                {/* Order ID + Status */}
                                <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-sm font-walsheim-bold text-foreground">
                                        {item.id}
                                    </Text>
                                    <View className="bg-green-100 px-3 py-1 rounded-full">
                                        <Text className="text-xs font-semibold text-green-700">
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Recipient */}
                                <Text className="text-xs text-gray-blue mb-3">
                                    Recipient: {item.recipient}
                                </Text>

                                {/* Divider */}
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
                                            {item.dropOff}
                                        </Text>
                                        <Text className="text-xs text-gray-blue mt-0.5">
                                            {item.date}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}