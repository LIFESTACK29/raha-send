import CustomButton from "@/src/components/form/CustomButton";
import OTPInput from "@/src/components/form/OTPInput";
import AuthLayout from "@/src/layouts/AuthLayout";
import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { MailCheck, Timer } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { useTimer } from "react-timer-hook";

const time = new Date();
time.setSeconds(time.getSeconds() + 60);

const VerifyEmailScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const { seconds, minutes, isRunning, start, pause, resume, restart } =
        useTimer({
            expiryTimestamp: time,
            onExpire: () => console.warn("Countdown Finished!"), // Your action here
        });
    const [code, setCode] = useState("");

    // const check = code.length === 4;

    return (
        <AuthLayout>
            <View className="flex-1 h-full px-5 py-5">
                <View className="gap-2">
                    <View className="w-16 h-16 bg-foreground flex flex-row items-center justify-center rounded-[18px]">
                        <MailCheck color={"#e8e8e8"} opacity={0.9} />
                    </View>
                    <Text className="text-foreground text-3xl font-bold">
                        Enter confirmation code
                    </Text>
                    <Text className="text-foreground/50 text-base font-normal">
                        Please enter the 4-digit code we sent to your email
                        address.
                    </Text>
                </View>
                <View className="py-5">
                    <OTPInput code={code} setCode={setCode} />
                    <View className="flex flex-col items-center gap-3 py-6">
                        <Text className="text-text-color text-center font-medium text-[16px]">
                            Didn't receive the code?
                        </Text>
                        <View className="bg-accent-green/50 h-9 rounded-full flex flex-row items-center gap-1 justify-center px-6">
                            <Timer size={17} color={"#022401"} />
                            <Text className="font-semibold tracking-tight text-sm text-foreground">
                                Resend in {minutes}:
                                {seconds < 10 ? `0${seconds}` : seconds}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="absolute bottom-10 w-full left-4 right-4">
                    <CustomButton
                        text="Verify Account"
                        action={() => navigate("MainApp")}
                    />
                </View>
            </View>
        </AuthLayout>
    );
};

export default VerifyEmailScreen;
