import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import AuthLayout from "@/src/layouts/AuthLayout";
import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const CreateAccountScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    return (
        <AuthLayout>
            <View className="flex-1 h-full px-4 py-5">
                <View>
                    <Text className="text-foreground text-3xl font-bold">
                        Create your account
                    </Text>
                    <View className="flex flex-row items-center px-0.5">
                        <Text className="text-foreground/75 font-medium">
                            Already have an account?
                        </Text>
                        <Pressable
                            className="py-2 px-1.5"
                            onPress={() => navigate("LoginAccount")}
                        >
                            <Text className="text-accent font-semibold">
                                Log in
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View className="py-8 flex flex-col gap-7">
                    <View className="flex-row gap-x-4">
                        <View className="flex-1">
                            <CustomInput
                                value={form.firstName}
                                setValue={(e: string) =>
                                    setForm({ ...form, firstName: e })
                                }
                                label="First name"
                            />
                        </View>
                        <View className="flex-1">
                            <CustomInput
                                value={form.lastName}
                                setValue={(e: string) =>
                                    setForm({ ...form, lastName: e })
                                }
                                label="Last name"
                            />
                        </View>
                    </View>
                    <View className="">
                        <CustomInput
                            value={form.email}
                            setValue={(e: string) =>
                                setForm({ ...form, email: e })
                            }
                            label="Email address"
                        />
                    </View>
                    <View className="">
                        <CustomInput
                            value={form.phoneNumber}
                            setValue={(e: string) =>
                                setForm({ ...form, phoneNumber: e })
                            }
                            label="Phone number"
                        />
                    </View>
                </View>
                <View className="absolute bottom-10 w-full left-4 right-4">
                    <CustomButton
                        text="Create account"
                        action={() => navigate("VerifyEmail")}
                    />
                </View>
            </View>
        </AuthLayout>
    );
};

export default CreateAccountScreen;
