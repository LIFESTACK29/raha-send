import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Button } from "@/src/components/button";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    // Fallback if user is null during development
    const firstName = user?.firstName || "Davidson";
    const lastName = user?.lastName || "Edgar";
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    const [signOutModalVisible, setSignOutModalVisible] = useState(false);

    const handleSignOut = () => {
        setSignOutModalVisible(true);
    };

    const confirmSignOut = () => {
        setSignOutModalVisible(false);
        logout();
        router.replace("/(auth)/login");
    };

    const menuItems = [
        {
            icon: "card-outline",
            title: "Payments",
            onPress: () => {},
        },
        {
            icon: "time-outline",
            title: "Delivery History",
            onPress: () => router.push("/(tabs)/history"),
        },
        {
            icon: "settings-outline",
            title: "Settings",
            onPress: () => router.push("/edit-profile"),
        },
        {
            icon: "help-circle-outline",
            title: "Support/FAQ",
            onPress: () => {},
        },
        {
            icon: "mail-outline",
            title: "Invite Friends",
            onPress: () => {},
        },
    ];

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />
            
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
                {/* Profile Header */}
                <View className="items-center mt-8 mb-6">
                    <View className="w-24 h-24 rounded-full bg-[#f96007] items-center justify-center mb-4">
                        <Text className="text-[32px] font-walsheim-bold text-white">
                            {initials}
                        </Text>
                    </View>
                    <Text className="text-xl font-walsheim-bold text-foreground">
                        {firstName} {lastName}
                    </Text>
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-gray-200 mx-6 mb-4" />

                {/* Menu Items */}
                <View className="px-2">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-row items-center px-6 py-4"
                            onPress={item.onPress}
                        >
                            <Ionicons
                                name={item.icon as any}
                                size={24}
                                color="#8e9bb0"
                                className="mr-4"
                            />
                            <Text className="text-base text-[#5c6e8d] font-walsheim ml-4">
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sign Out Button (at the bottom) */}
                <View className="mt-10 px-2 mb-10">
                    <TouchableOpacity
                        className="flex-row items-center px-6 py-4"
                        onPress={handleSignOut}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={24}
                            color="#ef4444"
                            style={{ transform: [{ rotate: "180deg" }] }}
                            className="mr-4"
                        />
                        <Text className="text-base text-[#5c6e8d] font-walsheim ml-4">
                            Sign out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Custom Sign Out Modal */}
            <Modal
                visible={signOutModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSignOutModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center px-6">
                    <View className="bg-white rounded-3xl p-6 shadow-lg items-center">
                        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                            <Ionicons
                                name="log-out-outline"
                                size={32}
                                color="#ef4444"
                                style={{ transform: [{ rotate: "180deg" }] }}
                            />
                        </View>
                        
                        <Text className="text-xl font-walsheim-bold text-foreground mb-2 text-center">
                            Sign Out
                        </Text>
                        <Text className="text-base text-gray-blue font-walsheim text-center mb-8">
                            Are you sure you want to sign out of your account? You will need to log in again.
                        </Text>

                        <View className="w-full gap-3 flex-row">
                            <View className="flex-1">
                                <Button
                                    title="Cancel"
                                    onPress={() => setSignOutModalVisible(false)}
                                    variant="outline"
                                    size="large"
                                    style={{ borderRadius: 12 }}
                                />
                            </View>
                            <View className="flex-1">
                                <Button
                                    title="Sign Out"
                                    onPress={confirmSignOut}
                                    variant="primary"
                                    size="large"
                                    style={{ borderRadius: 12, backgroundColor: "#ef4444" }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
