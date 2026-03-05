import CustomButton from "@/src/components/form/CustomButton";

import CustomInput from "@/src/components/form/CustomInput";

import AuthLayout from "@/src/layouts/AuthLayout";

import { Nav } from "@/src/types";

import { useNavigation } from "@react-navigation/native";

import { useState, useCallback } from "react";

import { Pressable, Text, View, ActivityIndicator } from "react-native";

import { useSignIn, useOAuth } from "@clerk/clerk-expo";

import * as WebBrowser from "expo-web-browser";

import { useWarmUpBrowser } from "@/src/helpers/useWarmUpBrowser";

import { useToast } from "@/src/context/ToastContext";

import { API_URL } from "@/src/const";

// import { useSetAtom } from "jotai";

// import { userAtom } from "@/src/store/user";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    useWarmUpBrowser();

    const { navigate } = useNavigation<Nav>();

    const { signIn, setActive, isLoaded } = useSignIn();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const { addToast } = useToast();

    // const setUser = useSetAtom(userAtom);

    const [form, setForm] = useState({
        email: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) return;

        // Email validation regex

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            addToast({
                title: "Invalid email",

                message: "Please enter a valid email address.",

                type: "error",
            });

            return;
        }

        setIsLoading(true);

        try {
            await signIn.create({
                identifier: form.email,
            });

            const factor = signIn.supportedFirstFactors?.find(
                (f) => f.strategy === "email_code",
            );

            if (!factor || !("emailAddressId" in factor)) {
                throw new Error("Email code strategy not supported");
            }

            await signIn.prepareFirstFactor({
                strategy: "email_code",

                emailAddressId: factor.emailAddressId,
            });

            navigate("VerifyEmail", { email: form.email });
        } catch (err: any) {
            console.log(JSON.stringify(err, null, 2));

            const isClerkError = err.clerkError === true;

            if (isClerkError) {
                const clerkErr = err.errors?.[0];

                if (clerkErr?.code === "form_param_format_invalid") {
                    addToast({
                        title: "Invalid Email Address",

                        message: "The email address you entered is not valid.",

                        type: "error",
                    });
                } else {
                    addToast({
                        title: "Sign In Failed",

                        message:
                            clerkErr?.longMessage || "Something went wrong",

                        type: "error",
                    });
                }
            } else {
                addToast({
                    title: "Connection Error",

                    message:
                        "Failed to sign in. Check your internet connection.",

                    type: "error",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onGoogleSignInPress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();

            if (createdSessionId) {
                await setActive!({ session: createdSessionId });
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <AuthLayout>
            <View className="flex-1 h-full px-4 py-5">
                <View className="gap-1">
                    <Text className="text-foreground text-2xl font-medium tracking-tight">
                        Welcome Back
                    </Text>

                    <Text className="text-foreground/50 text-base font-normal tracking-tight">
                        Let's get your deliveries moving. Enter your email to
                        continue.
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

                    {/* <View className="flex flex-row items-center py-1 px-1">

<Text className="text-foreground/75 font-medium tracking-tight">

Don't have an account?

</Text>

<Pressable

className="py-2 px-1.5"

onPress={() => navigate("CreateAccount")}

>

<Text className="text-accent font-semibold">

Create one

</Text>

</Pressable>

</View> */}
                </View>

                <View className="gap-4">
                    <CustomButton
                        text={
                            isLoading
                                ? "Sending code..."
                                : "Continue with Email"
                        }
                        disabled={isLoading || !form.email}
                        action={onSignInPress}
                    />

                    {/* <View className="flex flex-row items-center gap-2 py-2">

<View className="flex-1 h-[1px] bg-foreground/10" />

<Text className="text-foreground/30 text-sm font-medium">

OR

</Text>

<View className="flex-1 h-[1px] bg-foreground/10" />

</View>



<Pressable

onPress={onGoogleSignInPress}

className="flex flex-row items-center justify-center gap-3 bg-white border border-gray-200 h-14 rounded-2xl active:opacity-70 shadow-sm"

>

<Text className="text-foreground font-semibold text-base">

Continue with Google

</Text>

</Pressable> */}
                </View>

                {/* Original code commented as requested */}

                {/* <View className="absolute bottom-10 w-full left-4 right-4">

<CustomButton

text="Continue"

action={() => navigate("VerifyEmail")}

/>

</View> */}
            </View>
        </AuthLayout>
    );
};

export default LoginScreen;
