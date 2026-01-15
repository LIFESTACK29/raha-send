import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { BellDot } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const HomeHeader = () => {
    const { navigate } = useNavigation<Nav>();
    return (
        <View className="flex flex-row justify-between items-center py-2 px-5">
            <View>
                <Text className="text-foreground/70 text-base font-medium tracking-tight">
                    Dec 11, 2025
                </Text>
                <Text className="text-foreground text-2xl font-semibold tracking-tight">
                    Good morning, Chika
                </Text>
            </View>
            <Pressable
                onPress={() => navigate("Notifications")}
                className="bg-white w-[43px] h-[43px] rounded-full flex flex-row items-center justify-center"
            >
                <BellDot size={19} />
            </Pressable>
        </View>
    );
};

export default HomeHeader;
