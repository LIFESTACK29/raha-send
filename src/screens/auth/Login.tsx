import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import AuthLayout from "@/src/layouts/AuthLayout";
import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@/src/helpers/useWarmUpBrowser";
import { useToast } from "@/src/context/ToastContext";

const LoginScreen = () => {
    useWarmUpBrowser();
    const { navigate } = useNavigation<Nav>();
    const { signIn, isLoaded: signInLoaded } = useSignIn();
    const { signUp, isLoaded: signUpLoaded } = useSignUp();
    const { addToast } = useToast();

    const [form, setForm] = useState({ email: "" });
    const [isLoading, setIsLoading] = useState(false);

    const onContinuePress = async () => {
        if (!signInLoaded || !signUpLoaded) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            addToast({
                title: "Invalid email",
                message: "Enter a valid email.",
                type: "error",
            });
            return;
        }

        setIsLoading(true);

        try {
            // STEP 1: Always try to Sign In first
            try {
                console.log("Attempting Sign In...");
                await signIn.create({ identifier: form.email });

                const factor = signIn.supportedFirstFactors?.find(
                    (f) => f.strategy === "email_code",
                );

                if (!factor || !("emailAddressId" in factor)) {
                    throw new Error("Email code strategy not supported");
                }

                console.log("E-ID: ", factor.emailAddressId);

                // Prepare the factor (OTP)
                await signIn.prepareFirstFactor({
                    strategy: "email_code",
                    emailAddressId: factor.emailAddressId,
                });

                navigate("VerifyEmail", { email: form.email, type: "sign_in" });
            } catch (signInErr: any) {
                // STEP 2: If user NOT found, trigger Sign Up
                if (
                    signInErr.errors?.[0]?.code === "form_identifier_not_found"
                ) {
                    console.log("User not found, switching to Sign Up...");

                    await signUp.create({ emailAddress: form.email });
                    await signUp.prepareEmailAddressVerification({
                        strategy: "email_code",
                    });

                    navigate("VerifyEmail", {
                        email: form.email,
                        type: "sign_up",
                    });
                } else {
                    // If it's a different error (e.g. rate limit), throw it to the outer catch
                    throw signInErr;
                }
            }
        } catch (err: any) {
            console.error("Auth Error:", JSON.stringify(err, null, 2));
            addToast({
                title: "Error",
                message: err.errors?.[0]?.longMessage || "An error occurred.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <View className="flex-1 px-4 py-5">
                <View className="gap-1">
                    <Text className="text-foreground text-2xl font-medium">
                        Welcome
                    </Text>
                    <Text className="text-foreground/50 text-base">
                        Enter your email to continue.
                    </Text>
                </View>
                <View className="py-8">
                    <CustomInput
                        value={form.email}
                        setValue={(e: string) => setForm({ ...form, email: e })}
                        label="Email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <CustomButton
                    text={isLoading ? "Processing..." : "Continue"}
                    disabled={isLoading || !form.email}
                    action={onContinuePress}
                />
            </View>
        </AuthLayout>
    );
};

export default LoginScreen;
