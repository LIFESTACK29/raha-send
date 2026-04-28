import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "Davidson",
        lastName: user?.lastName || "Edgar",
        email: user?.email || "davidsone@example.com",
        phoneNumber: user?.phoneNumber || "08123456789",
    });
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call for now since we're just building UI
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Profile updated successfully!");
            router.back();
        }, 1000);
    };

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-white" 
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar style="dark" />
            
            {/* Header */}
            <View 
                className="flex-row items-center px-5 pb-4 border-b border-gray-100"
                style={{ paddingTop: insets.top + 16 }}
            >
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text className="text-xl font-walsheim-bold text-foreground">
                    Edit Profile
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
            >
                <Text className="text-base text-gray-blue font-walsheim mb-6">
                    Update your personal information. Your email cannot be changed from here.
                </Text>

                <View className="gap-6">
                    <View>
                        <Text className="text-sm font-walsheim text-gray-500 mb-2 pl-1">
                            First Name
                        </Text>
                        <Input
                            placeholder="First Name"
                            value={formData.firstName}
                            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-walsheim text-gray-500 mb-2 pl-1">
                            Last Name
                        </Text>
                        <Input
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-walsheim text-gray-500 mb-2 pl-1">
                            Phone Number
                        </Text>
                        <Input
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            keyboardType="phone-pad"
                            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-walsheim text-gray-500 mb-2 pl-1">
                            Email Address (Read-only)
                        </Text>
                        <View className="opacity-60">
                            <Input
                                placeholder="Email"
                                value={formData.email}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>

                <View className="mt-10">
                    <Button
                        title={loading ? "Saving..." : "Save Changes"}
                        onPress={handleSave}
                        variant="primary"
                        size="large"
                        disabled={loading}
                        style={{ borderRadius: 12, opacity: loading ? 0.7 : 1 }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
