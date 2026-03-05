import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { MoveLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const SubAppHeader = ({ title }: { title?: string }) => {
    const { goBack } = useNavigation<Nav>();

    const goBackFunction = () => {
        goBack();
    };

    return (
        <View className="flex flex-row justify-between items-center px-4">
            <View className="flex flex-row items-center justify-between gap-3 w-full">
                <Pressable
                    className="w-12 h-12 rounded-full flex flex-row justify-center items-center bg-[#FFFFFF0D]"
                    onPress={goBackFunction}
                >
                    <MoveLeft color="#022401" />
                </Pressable>
                {title && (
                    <Text className="text-foreground text-lg font-medium tracking-tight">
                        {title}
                    </Text>
                )}
                <Pressable className="w-12 h-12"></Pressable>
            </View>
        </View>
    );
};

export default SubAppHeader;
