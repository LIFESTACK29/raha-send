import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import { authService, handleApiError } from "@/src/api/authService";
import { useAuthStore } from "@/src/store/useAuthStore";
import * as SecureStore from "expo-secure-store";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { setAuth, setTempAuthData } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setErrors({});
            await loginSchema.validate(formData, { abortEarly: false });

            setLoading(true);
            const response = await authService.login(formData.email, formData.password);

            if (response.isOnboarded) {
                // Fully verified
                await SecureStore.setItemAsync("token", response.token);
                await SecureStore.setItemAsync("user", JSON.stringify(response.user));
                setAuth(response.user, response.token);
                router.replace("/(tabs)");
            } else {
                // Not verified, send to OTP
                setTempAuthData(response.userId, formData.email);
                router.push("/(auth)/otp");
            }
        } catch (error: any) {
            if (error instanceof yup.ValidationError) {
                const validationErrors: Record<string, string> = {};
                error.inner.forEach((err) => {
                    if (err.path) validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                Alert.alert("Login Failed", handleApiError(error));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar style="dark" />
            <View
                className="px-8 flex-1"
                style={{ paddingTop: insets.top + 40 }}
            >
                {/* Logo Section */}
                <View className="items-center mb-16">
                    <Image
                        source={require("@/src/assets/images/logo.png")}
                        className="w-40 h-20"
                        resizeMode="contain"
                    />
                </View>

                {/* Welcome Section */}
                <View className="mb-10">
                    <Text className="text-3xl font-walsheim-bold text-foreground mb-2">
                        Welcome
                    </Text>
                    <Text className="text-base text-gray-blue font-walsheim">
                        Please input your details
                    </Text>
                </View>

                {/* Form Section */}
                <View className="mb-4">
                    <View className="mb-6">
                        <Input
                            placeholder="youremailaddress@address.com"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                        />
                        {errors.email && (
                            <Text className="text-red-500 text-xs mt-1 pl-2 font-walsheim">
                                {errors.email}
                            </Text>
                        )}
                    </View>
                    <View className="mb-6">
                        <Input
                            placeholder="••••••••••••"
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry
                        />
                        {errors.password && (
                            <Text className="text-red-500 text-xs mt-1 pl-2 font-walsheim">
                                {errors.password}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity className="items-end mb-10">
                    <Text className="text-sm font-walsheim-bold text-foreground">
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                {/* Action Button */}
                <View className="mb-8">
                    <Button
                        title={loading ? "Logging in..." : "Get Started"}
                        onPress={handleLogin}
                        variant="primary"
                        size="large"
                        disabled={loading}
                        style={{ borderRadius: 12, opacity: loading ? 0.7 : 1 }}
                    />
                </View>

                {/* Footer Link */}
                <View className="flex-row justify-center items-center gap-1 mt-auto pb-10">
                    <Text className="text-base text-gray-blue font-walsheim">
                        Need an account?{" "}
                    </Text>
                    <Link href="/(auth)/signup" asChild>
                        <TouchableOpacity>
                            <Text className="text-base font-walsheim-bold text-foreground">
                                Sign up
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}
