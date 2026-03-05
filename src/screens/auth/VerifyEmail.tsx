import CustomButton from "@/src/components/form/CustomButton";
import OTPInput from "@/src/components/form/OTPInput";
import AuthLayout from "@/src/layouts/AuthLayout";
import { Nav } from "@/src/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Timer } from "lucide-react-native";
import { useState, useMemo, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useTimer } from "react-timer-hook";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useToast } from "@/src/context/ToastContext";

const VerifyEmailScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const route = useRoute<any>();
    const { email, type } = route.params || {}; // 'sign_in' or 'sign_up'

    const {
        signIn,
        setActive: setSignInActive,
        isLoaded: signInLoaded,
    } = useSignIn();
    const {
        signUp,
        setActive: setSignUpActive,
        isLoaded: signUpLoaded,
    } = useSignUp();
    const { addToast } = useToast();

    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fix: Timer starts exactly when screen mounts
    const expiryTimestamp = useMemo(() => {
        const t = new Date();
        t.setSeconds(t.getSeconds() + 60);
        return t;
    }, []);

    const { seconds, minutes, isRunning, restart } = useTimer({
        expiryTimestamp,
        autoStart: true,
    });

    // Security check: Redirect if params are missing
    useEffect(() => {
        if (!email || !type) navigate("Login" as any);
    }, [email, type]);

    const onVerifyPress = async () => {
        if (!signInLoaded || !signUpLoaded) return;
        setIsLoading(true);

        try {
            if (type === "sign_in") {
                const result = await signIn.attemptFirstFactor({
                    strategy: "email_code",
                    code,
                });
                if (result.status === "complete") {
                    await setSignInActive({ session: result.createdSessionId });
                }
            } else {
                const result = await signUp.attemptEmailAddressVerification({
                    code,
                });
                if (result.status === "complete") {
                    await setSignUpActive({ session: result.createdSessionId });
                }
            }
        } catch (err: any) {
            addToast({
                title: "Invalid Code",
                message:
                    err.errors?.[0]?.longMessage || "The code is incorrect.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onResendPress = async () => {
        // This 'if' block satisfies the TS compiler by ensuring
        // signIn and signUp exist before the logic runs.
        if (!signIn || !signUp) {
            return;
        }

        try {
            if (type === "sign_in") {
                const factor = signIn.supportedFirstFactors?.find(
                    (f) => f.strategy === "email_code",
                );

                // Added a check to make sure the factor was actually found
                if (factor && "emailAddressId" in factor) {
                    await signIn.prepareFirstFactor({
                        strategy: "email_code",
                        emailAddressId: factor.emailAddressId,
                    });
                } else {
                    throw new Error("No valid email factor found");
                }
            } else {
                // Flow for new users
                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                });
            }

            // Reset the UI/Timer
            const newTime = new Date();
            newTime.setSeconds(newTime.getSeconds() + 60);
            restart(newTime);

            addToast({
                title: "Sent",
                message: "A new code has been sent.",
                type: "success",
            });
        } catch (err: any) {
            console.error("Resend error:", JSON.stringify(err, null, 2));
            addToast({
                title: "Error",
                message: "Could not resend code. Please try again.",
                type: "error",
            });
        }
    };

    return (
        <AuthLayout>
            <View className="flex-1 px-5 py-5">
                <Text className="text-foreground text-2xl font-medium">
                    Verify Email
                </Text>
                <Text className="text-foreground/50 text-base mb-5">
                    Code sent to {email}
                </Text>

                <OTPInput code={code} setCode={setCode} />

                <View className="items-center py-6 gap-4">
                    <Pressable
                        onPress={onResendPress}
                        disabled={isRunning}
                        className="flex-row items-center gap-2 opacity-80"
                    >
                        <Timer size={18} color="#000" />
                        <Text>
                            {isRunning
                                ? `Resend in ${minutes}:${seconds.toString().padStart(2, "0")}`
                                : "Resend Code"}
                        </Text>
                    </Pressable>
                </View>

                <View className="absolute bottom-10 left-4 right-4">
                    <CustomButton
                        text={isLoading ? "Verifying..." : "Verify Account"}
                        action={onVerifyPress}
                        disabled={code.length < 6 || isLoading}
                    />
                </View>
            </View>
        </AuthLayout>
    );
};

export default VerifyEmailScreen;
