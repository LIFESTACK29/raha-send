import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import AppLayout from "@/src/layouts/AppLayout";
import ProfileHeader from "@/src/components/section/ProfileHeader";
import ProfileMenuItem from "@/src/components/card/ProfileMenuItem";
import { useAuth } from "@clerk/clerk-expo";
import GorhomBottomSheet from "@/src/components/misc/CustomBottomSheet";
import { useAtom } from "jotai";
import { userAtom } from "@/src/store/user";
import {
    User,
    LogOut,
    X,
    Bell,
    Shield,
    FileText,
    HelpCircle,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";

const RiderProfileScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const { signOut } = useAuth();
    const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
    const [user, setUser] = useAtom(userAtom);

    const handleLogout = async () => {
        try {
            await signOut();
            setUser(null);
            setIsLogoutSheetOpen(false);
        } catch (error) {
            console.error("Logout error", error);
            setIsLogoutSheetOpen(false);
        }
    };

    return (
        <AppLayout>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                {/* Profile Header */}
                <ProfileHeader />

                {/* Account Section */}
                <View className="px-5 mt-2">
                    <Text className="text-foreground text-sm font-semibold tracking-tight mb-2 px-1 uppercase opacity-50">
                        Rider Account
                    </Text>
                    <ProfileMenuItem
                        icon={User}
                        label="Personal Information"
                        description="Name, phone, document status"
                        iconBg="bg-light-orange/30"
                        iconColor="#f45900"
                        onPress={() => navigate("RiderPersonalInformation")}
                    />
                </View>

                {/* Preferences Section */}
                <View className="px-5 mt-6">
                    <Text className="text-foreground text-sm font-semibold tracking-tight mb-2 px-1 uppercase opacity-50">
                        Preferences
                    </Text>
                    <ProfileMenuItem
                        icon={Bell}
                        label="Notifications"
                        iconBg="bg-[#FFEFD2]"
                        iconColor="#B08300"
                    />
                </View>

                {/* Support & Legal Section */}
                <View className="px-5 mt-6">
                    <Text className="text-foreground text-sm font-semibold tracking-tight mb-2 px-1 uppercase opacity-50">
                        Support & Legal
                    </Text>
                    <ProfileMenuItem
                        icon={HelpCircle}
                        label="Help Center"
                        iconBg="bg-accent-green/30"
                        iconColor="#022401"
                    />
                    <ProfileMenuItem
                        icon={Shield}
                        label="Privacy & Security"
                        iconBg="bg-light-gray"
                        iconColor="#022401"
                    />
                    <ProfileMenuItem
                        icon={FileText}
                        label="Terms of Service"
                        iconBg="bg-light-gray"
                        iconColor="#022401"
                    />
                </View>

                {/* Logout */}
                <View className="px-5 mt-6">
                    <ProfileMenuItem
                        icon={LogOut}
                        label="Log Out"
                        danger={true}
                        iconBg="bg-red-50"
                        onPress={() => setIsLogoutSheetOpen(true)}
                    />
                </View>
            </ScrollView>

            <GorhomBottomSheet
                visible={isLogoutSheetOpen}
                onClose={() => setIsLogoutSheetOpen(false)}
                snapPoints={["32%"]}
            >
                <View className="p-6 pt-2">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-foreground">
                            Log Out
                        </Text>
                        <Pressable onPress={() => setIsLogoutSheetOpen(false)}>
                            <View className="bg-light-gray w-8 h-8 rounded-full items-center justify-center">
                                <X size={18} color="#000" />
                            </View>
                        </Pressable>
                    </View>

                    <Text className="text-foreground/70 text-[15px] mb-6">
                        Are you sure you want to log out of your rider account?
                    </Text>

                    <View className="flex-row gap-4">
                        <Pressable
                            className="flex-1 bg-light-gray py-4 rounded-2xl items-center"
                            onPress={() => setIsLogoutSheetOpen(false)}
                        >
                            <Text className="font-bold text-foreground">
                                Cancel
                            </Text>
                        </Pressable>
                        <Pressable
                            className="flex-1 bg-red-500 py-4 rounded-2xl items-center"
                            onPress={handleLogout}
                        >
                            <Text className="font-bold text-white">
                                Log Out
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </GorhomBottomSheet>
        </AppLayout>
    );
};

export default RiderProfileScreen;
