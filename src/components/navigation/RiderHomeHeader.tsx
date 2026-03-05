import { Switch, Text, View, Pressable } from "react-native";
import { useAtomValue } from "jotai";
import { userAtom } from "@/src/store/user";
import { useState } from "react";
import { BellDot } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";

const RiderHomeHeader = () => {
    const user = useAtomValue(userAtom);
    const firstName = user?.fullName?.split(" ")[0] || "Rider";
    const [isOnline, setIsOnline] = useState(true);
    const { navigate } = useNavigation<Nav>();

    return (
        <View className="flex-row items-center justify-between px-5 py-4">
            <View>
                <Text className="text-gray-400 text-sm font-medium tracking-tight mb-1">
                    Welcome back
                </Text>
                <Text className="text-foreground text-xl font-medium tracking-tight capitalize">
                    {firstName}
                </Text>
            </View>

            <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full border border-gray-100 mr-3">
                    <View
                        className={`w-2 h-2 rounded-full mr-2 ${
                            isOnline ? "bg-accent-green" : "bg-red-500"
                        }`}
                    />
                    <Text className="text-foreground text-sm font-medium mr-2">
                        {isOnline ? "Online" : "Offline"}
                    </Text>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: "#E5E7EB", true: "#E7F6ED" }}
                        thumbColor={isOnline ? "#022401" : "#f4f3f4"}
                        ios_backgroundColor="#E5E7EB"
                        style={{
                            transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                    />
                </View>

                <Pressable
                    onPress={() => navigate("Notifications")}
                    className="bg-white w-[39px] h-[39px] rounded-full flex flex-row items-center justify-center"
                >
                    <BellDot size={18} />
                </Pressable>
            </View>
        </View>
    );
};

export default RiderHomeHeader;
