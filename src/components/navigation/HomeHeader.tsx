import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { BellDot } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useAtomValue } from "jotai";
import { userAtom } from "@/src/store/user";

const HomeHeader = () => {
    const { navigate } = useNavigation<Nav>();
    const user = useAtomValue(userAtom);
    const firstName = user?.fullName?.split(" ")[0] || "User";
    const currentDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    console.log("USER: ", user);

    return (
        <View className="flex flex-row justify-between items-center py-2 px-5">
            <View>
                <Text className="text-foreground/70 text-sm font-medium tracking-tight">
                    {currentDate}
                </Text>
                <Text className="text-foreground text-xl font-medium tracking-tight capitalize">
                    Good morning, {firstName}
                </Text>
            </View>
            <Pressable
                onPress={() => navigate("Notifications")}
                className="bg-white w-[39px] h-[39px] rounded-full flex flex-row items-center justify-center"
            >
                <BellDot size={18} />
            </Pressable>
        </View>
    );
};

export default HomeHeader;
