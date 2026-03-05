import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import AuthLayout from "@/src/layouts/AuthLayout";
import { Nav } from "@/src/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Pressable, Text, View, Alert } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { cn } from "@/src/lib/utils";
import { API_URL } from "@/src/const";
import { useSetAtom } from "jotai";
import { userAtom } from "@/src/store/user";

const OnboardingScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const route = useRoute<any>();
    const { user, isLoaded } = useUser();
    const setUser = useSetAtom(userAtom);

    useEffect(() => {
        console.log(
            "[OnboardingScreen] Mounted. isLoaded:",
            isLoaded,
            "user.id:",
            user?.id,
        );
    }, [isLoaded, user?.id]);

    if (!isLoaded) return null;

    const email =
        route.params?.email || user?.primaryEmailAddress?.emailAddress;
    const clerkId = user?.id;

    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        phoneNumber: "",
        role: "" as "customer" | "rider",
    });
    const [isLoading, setIsLoading] = useState(false);

    const onCompleteOnboarding = async () => {
        console.log("Onboarding...");
        if (!form.role || !form.fullName) {
            Alert.alert(
                "Error",
                "Please fill in all details and select a role.",
            );
            return;
        }

        setIsLoading(true);
        try {
            // Replace with your actual server URL from env or constants
            const response = await axios.post(`${API_URL}/user/onboard`, {
                clerkId,
                email,
                fullName: form.fullName,
                phoneNumber: form.phoneNumber,
                role: form.role,
            });

            console.log("RESPONSE: ", response);

            if (response.data.user) {
                // Save user to jotai atom
                setUser({
                    clerkId: clerkId!,
                    email: email!,
                    fullName: form.fullName,
                    phoneNumber: form.phoneNumber,
                    role: response.data.user.role,
                    isOnboarded: response.data.user.isOnboarded,
                });
            }
        } catch (err: any) {
            console.error("Onboarding error:", err);
            Alert.alert(
                "Error",
                "Failed to complete onboarding. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout disableBackButton>
            <View className="flex-1 h-full px-4 py-5">
                <View className="gap-1">
                    <Text className="text-foreground text-2xl font-medium tracking-tight">
                        Complete Profile
                    </Text>
                    <Text className="text-foreground/50 text-base font-normal tracking-tight">
                        Tell us a bit more about yourself to get started.
                    </Text>
                </View>

                <View className="py-8 gap-4">
                    <CustomInput
                        value={form.fullName}
                        setValue={(e: string) =>
                            setForm({ ...form, fullName: e })
                        }
                        label="Full Name"
                    />
                    <CustomInput
                        value={form.phoneNumber}
                        setValue={(e: string) =>
                            setForm({ ...form, phoneNumber: e })
                        }
                        label="Phone Number"
                        keyboardType="phone-pad"
                    />

                    <View className="gap-2">
                        <Text className="text-foreground font-medium">
                            I am a:
                        </Text>
                        <View className="flex flex-row gap-3">
                            <Pressable
                                onPress={() =>
                                    setForm({ ...form, role: "customer" })
                                }
                                className={cn(
                                    "flex-1 h-14 rounded-2xl border-2 items-center justify-center",
                                    form.role === "customer"
                                        ? "border-accent bg-accent/5"
                                        : "border-foreground/10",
                                )}
                            >
                                <Text
                                    className={cn(
                                        "font-semibold",
                                        form.role === "customer"
                                            ? "text-accent"
                                            : "text-foreground/50",
                                    )}
                                >
                                    Customer
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() =>
                                    setForm({ ...form, role: "rider" })
                                }
                                className={cn(
                                    "flex-1 h-14 rounded-2xl border-2 items-center justify-center",
                                    form.role === "rider"
                                        ? "border-accent bg-accent/5"
                                        : "border-foreground/10",
                                )}
                            >
                                <Text
                                    className={cn(
                                        "font-semibold",
                                        form.role === "rider"
                                            ? "text-accent"
                                            : "text-foreground/50",
                                    )}
                                >
                                    Rider
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View className="mt-auto pb-10">
                    <CustomButton
                        text={isLoading ? "Saving..." : "Start Using Send"}
                        disabled={isLoading || !form.role || !form.fullName}
                        action={onCompleteOnboarding}
                    />
                </View>
            </View>
        </AuthLayout>
    );
};

export default OnboardingScreen;
