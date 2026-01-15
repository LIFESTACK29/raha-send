import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import AuthLayout from "@/src/layouts/AuthLayout";
import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const LoginScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const [form, setForm] = useState({
        email: "",
    });

    return (
        <AuthLayout>
            <View className="flex-1 h-full px-4 py-5">
                <View className="gap-1">
                    <Text className="text-foreground text-3xl font-bold">
                        Welcome Back
                    </Text>
                    <Text className="text-foreground/50 text-base font-normal">
                        Let's get your deliveries moving. Enter your email to
                        continue.
                    </Text>
                </View>
                <View className="py-8">
                    <CustomInput
                        value={form.email}
                        setValue={(e: string) => setForm({ ...form, email: e })}
                        label="Email address"
                    />
                    <View className="flex flex-row items-center py-1 px-1">
                        <Text className="text-foreground/75 font-medium">
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
                    </View>
                </View>
                <View className="absolute bottom-10 w-full left-4 right-4">
                    <CustomButton
                        text="Continue"
                        action={() => navigate("VerifyEmail")}
                    />
                </View>
            </View>
        </AuthLayout>
    );
};

export default LoginScreen;
