import React from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    
    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />
            <View className="flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-foreground">History</Text>
            </View>
        </View>
    );
}
