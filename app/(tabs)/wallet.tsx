import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WalletHomeScreen } from "@/src/features/wallet/screens/WalletHomeScreen";

export default function WalletScreen() {
    const insets = useSafeAreaInsets();
    
    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />
            <WalletHomeScreen />
        </View>
    );
}
