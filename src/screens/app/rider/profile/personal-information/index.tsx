import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import {
    Keyboard,
    ScrollView,
    TouchableWithoutFeedback,
    View,
    Text,
} from "react-native";
import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/src/store/user";
import axios from "axios";
import { API_URL } from "@/src/const";
import CustomInput from "@/src/components/form/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";
import CustomButton from "@/src/components/form/CustomButton";
import { useToast } from "@/src/context/ToastContext";
import { useAuth } from "@clerk/clerk-expo";

const RiderPersonalInformationScreen = () => {
    const { goBack } = useNavigation<Nav>();
    const [user, setUser] = useAtom(userAtom);
    const { addToast } = useToast();
    const { getToken } = useAuth();
    const [editForm, setEditForm] = useState({
        fullName: user?.fullName || "",
        phoneNumber: user?.phoneNumber || "",
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const token = await getToken();
            const response = await axios.patch(
                `${API_URL}/user/profile/${user.clerkId}`,
                {
                    fullName: editForm.fullName,
                    phoneNumber: editForm.phoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.user) {
                setUser({
                    ...user,
                    fullName: response.data.user.fullName,
                    phoneNumber: response.data.user.phoneNumber,
                });
                addToast({
                    title: "Success",
                    message: "Profile updated successfully!",
                    type: "success",
                });
                goBack();
            }
        } catch (error: any) {
            console.error(
                "Error updating profile:",
                error.response?.data || error.message,
            );
            addToast({
                title: "Error",
                message:
                    error.response?.data?.message ||
                    "Failed to update profile. Please try again.",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SubAppLayout>
            <SubAppHeader title="Personal Information" />
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <ScrollView
                    className="flex-1 px-5 py-3"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1" style={{ paddingTop: 10 }}>
                        {/* Name Input */}
                        <View className="mb-2">
                            <CustomInput
                                value={editForm.fullName}
                                setValue={(text: string) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        fullName: text,
                                    }))
                                }
                                label="Full Name"
                                placeholder="Enter your full name"
                            />
                        </View>

                        {/* Phone Input */}
                        <View className="mb-2">
                            <CustomInput
                                value={editForm.phoneNumber}
                                setValue={(text: string) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        phoneNumber: text,
                                    }))
                                }
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Read-Only Email */}
                        <View className="mb-6 mt-2 pb-6">
                            <Text className="text-foreground text-base font-medium mb-1 tracking-[-0.15px] px-1.5 opacity-60">
                                Email Address (Cannot be changed)
                            </Text>
                            <View className="h-[4.5rem] bg-gray-300 rounded-[18px] border border-gray-200/80 opacity-70 px-5 justify-center mx-[2px] mb-1">
                                <Text className="text-base text-gray-800">
                                    {user?.email || "No email available"}
                                </Text>
                            </View>
                        </View>

                        {/* Document Status - Display Only */}
                        <View className="mb-6 pb-6">
                            <Text className="text-foreground text-base font-medium mb-1 tracking-[-0.15px] px-1.5 opacity-60">
                                Valid Document Status
                            </Text>
                            <View className="h-[4.5rem] bg-gray-300 rounded-[18px] border border-gray-200/80 opacity-70 px-5 flex-row items-center justify-between mx-[2px] mb-1">
                                <Text className="text-base text-gray-800">
                                    Driver's License
                                </Text>
                                <Text className="text-sm font-semibold text-accent-green uppercase">
                                    Approved
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <View className="pt-2 pb-10">
                        <CustomButton
                            text={isSaving ? "Saving..." : "Save Changes"}
                            disabled={isSaving}
                            action={handleSaveProfile}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SubAppLayout>
    );
};

export default RiderPersonalInformationScreen;
