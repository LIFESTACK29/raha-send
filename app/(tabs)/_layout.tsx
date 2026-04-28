import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemeColors } from "@/constants/theme";

import { Platform } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#01656c", // Dark teal color for active state
                tabBarInactiveTintColor: ThemeColors.grayBlue,
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopColor: "#f1f1f1",
                    borderTopWidth: 1,
                    paddingTop: 12,
                    paddingBottom: Platform.OS === "ios" ? 28 : 12,
                    height: Platform.OS === "ios" ? 90 : 75,
                    elevation: 10, // Shadow for Android
                    shadowColor: "#000", // Shadow for iOS
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontWeight: "600",
                    fontSize: 12,
                    marginTop: 4,
                },
                headerShown: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="list-alt" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: "Wallet",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="credit-card" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="cog" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
