import { Button } from "@/src/components/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { authService, handleApiError } from "@/src/api/authService";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function OtpScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const { tempUserId, tempEmail, setAuth } = useAuthStore();

    const displayPhone = email || tempEmail || "****";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    const startCooldown = () => {
        setResendCooldown(60);
        cooldownRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleTextChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = ({ nativeEvent }: any, index: number) => {
        if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join("");
        if (fullCode.length !== 6) {
            Alert.alert("Incomplete Code", "Please enter the entire 6-digit OTP.");
            return;
        }

        if (!tempUserId) {
            Alert.alert("Session Error", "No active verification session found. Please login again.");
            router.replace("/(auth)/login");
            return;
        }

        try {
            setLoading(true);
            const response = await authService.verifyOTP(tempUserId, fullCode);

            await SecureStore.setItemAsync("token", response.token);
            await SecureStore.setItemAsync("user", JSON.stringify(response.user));

            setAuth(response.user, response.token);
            router.replace("/(tabs)");
        } catch (error: any) {
            Alert.alert("Verification Failed", handleApiError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        if (!tempEmail) {
            Alert.alert("Error", "We lost track of your email. Please login again.");
            return;
        }
        try {
            await authService.resendOTP(tempEmail);
            Alert.alert("Sent", "A new OTP has been sent to your email.");
            startCooldown();
        } catch (error: any) {
            Alert.alert("Error", handleApiError(error));
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                className="flex-1 bg-white"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
            >
                <StatusBar style="dark" />
                <View
                    className="px-6 flex-1"
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

                    {/* Heading Section */}
                    <View className="mb-10">
                        <Text className="text-[28px] font-walsheim-bold text-black mb-3">
                            Enter the 6-digit code
                        </Text>
                        <Text className="text-base text-gray-500 mb-3 leading-relaxed font-walsheim">
                            Please input the verification code sent to {displayPhone}
                        </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-[15px] font-walsheim-bold text-[#01656c]">
                                Change number/email?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* OTP Inputs */}
                    <View className="flex-row gap-2 mb-8 w-full justify-center">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    inputs.current[index] = ref;
                                }}
                                className="w-12 h-14 bg-[#f4f7f8] rounded-xl text-center text-2xl font-walsheim-medium text-black"
                                keyboardType="number-pad"
                                maxLength={1}
                                value={code[index]}
                                onChangeText={(text) => handleTextChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                            />
                        ))}
                    </View>

                    {/* Resend Code */}
                    <View className="flex-row items-center mb-12 justify-center">
                        <Text className="text-[15px] text-gray-500 font-walsheim">
                            Didn't get any code yet?{" "}
                        </Text>
                        <TouchableOpacity onPress={handleResend} disabled={resendCooldown > 0}>
                            <Text
                                className="text-[15px] font-walsheim-bold underline"
                                style={{ color: resendCooldown > 0 ? "#9ca3af" : "#01656c" }}
                            >
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Verify Button */}
                    <View className="mb-8">
                        <Button
                            title={loading ? "Verifying..." : "Verify"}
                            onPress={handleVerify}
                            variant="primary"
                            size="large"
                            disabled={loading}
                            style={{ borderRadius: 12, opacity: loading ? 0.7 : 1 }}
                            textStyle={{ fontWeight: "bold" }}
                        />
                    </View>

                    {/* Terms & Privacy */}
                    <View className="items-center mt-auto pb-4">
                        <Text className="text-sm text-gray-500 text-center leading-relaxed font-walsheim">
                            By signing up, you agree to snap{"\n"}
                            <Text className="underline">Terms of Service</Text> and{" "}
                            <Text className="underline">Privacy Policy</Text>.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
