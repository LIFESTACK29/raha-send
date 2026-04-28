import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import { authService, handleApiError } from "@/src/api/authService";
import { useAuthStore } from "@/src/store/useAuthStore";

const signupSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    password: yup.string()
        .required("Password is required")
        .min(8, "Min 8 characters")
        .matches(/[A-Z]/, "Must contain at least 1 uppercase")
        .matches(/[0-9]/, "Must contain at least 1 number"),
});

export default function SignupScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { setTempAuthData } = useAuthStore();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        try {
            setErrors({});
            await signupSchema.validate(formData, { abortEarly: false });

            setLoading(true);
            const data = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password,
                role: "customer",
            };

            const response = await authService.register(data);

            // Navigate to OTP page
            setTempAuthData(response.userId, formData.email);
            router.push(`/(auth)/otp?email=${encodeURIComponent(formData.email)}`);
        } catch (error: any) {
            if (error instanceof yup.ValidationError) {
                const validationErrors: Record<string, string> = {};
                error.inner.forEach((err) => {
                    if (err.path) validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                Alert.alert("Error", handleApiError(error));
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
                        Let's get started
                    </Text>
                    <Text className="text-base text-gray-blue font-walsheim">
                        Please input your details
                    </Text>
                </View>

                {/* Form Section */}
                <View className="mb-4">
                    {/* First & Last Name Row */}
                    <View className="flex-row gap-3 mb-6">
                        <View className="flex-1">
                            <Input
                                placeholder="First name"
                                value={formData.firstName}
                                onChangeText={(text) =>
                                    setFormData({ ...formData, firstName: text })
                                }
                            />
                            {errors.firstName && (
                                <Text className="text-red-500 text-xs mt-1 pl-2 font-walsheim">
                                    {errors.firstName}
                                </Text>
                            )}
                        </View>
                        <View className="flex-1">
                            <Input
                                placeholder="Last name"
                                value={formData.lastName}
                                onChangeText={(text) =>
                                    setFormData({ ...formData, lastName: text })
                                }
                            />
                            {errors.lastName && (
                                <Text className="text-red-500 text-xs mt-1 pl-2 font-walsheim">
                                    {errors.lastName}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View className="mb-6">
                        <Input
                            placeholder="Your phone number"
                            value={formData.phone}
                            onChangeText={(text) =>
                                setFormData({ ...formData, phone: text })
                            }
                            keyboardType="phone-pad"
                        />
                        {errors.phone && (
                            <Text className="text-red-500 text-xs mt-1 pl-2 font-walsheim">
                                {errors.phone}
                            </Text>
                        )}
                    </View>

                    {/* Email */}
                    <View className="mb-6">
                        <Input
                            placeholder="Your email"
                            value={formData.email}
                            onChangeText={(text) =>
                                setFormData({ ...formData, email: text })
                            }
                            keyboardType="email-address"
                        />
                        {errors.email && (
                            <Text className="text-red-500 text-xs mt-1 pl-2 font-walsheim">
                                {errors.email}
                            </Text>
                        )}
                    </View>

                    {/* Password */}
                    <View className="mb-6">
                        <Input
                            placeholder="Your password"
                            value={formData.password}
                            onChangeText={(text) =>
                                setFormData({ ...formData, password: text })
                            }
                            secureTextEntry
                        />
                        {errors.password && (
                            <Text className="text-red-500 text-xs mt-1 pl-2 font-walsheim">
                                {errors.password}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Action Button */}
                <View className="mb-6">
                    <Button
                        title={loading ? "Registering..." : "Continue"}
                        onPress={handleSignup}
                        variant="primary"
                        size="large"
                        disabled={loading}
                        style={{ borderRadius: 12, opacity: loading ? 0.7 : 1 }}
                    />
                </View>

                {/* Terms & Privacy */}
                <View className="items-center mb-8">
                    <Text className="text-sm text-gray-blue text-center font-walsheim">
                        By signing up, you agree to our{" "}
                        <Text className="text-foreground font-walsheim-bold">
                            Terms of Service
                        </Text>{" "}
                        and{" "}
                        <Text className="text-foreground font-walsheim-bold">
                            Privacy Policy
                        </Text>
                    </Text>
                </View>

                {/* Footer Link */}
                <View className="flex-row justify-center items-center gap-1 mt-auto pb-10">
                    <Text className="text-base text-gray-blue font-walsheim">
                        Already have an account?{" "}
                    </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-base font-walsheim-bold text-foreground">
                                Sign in
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}