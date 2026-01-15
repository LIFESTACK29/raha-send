import { JSX } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MoveLeft } from "lucide-react-native";
import { Nav } from "../types";
import { useNavigation } from "@react-navigation/native";

const AuthLayout = ({ children }: { children: JSX.Element }) => {
    const { goBack } = useNavigation<Nav>();
    return (
        <SafeAreaView className="h-full bg-background">
            <View className="px-5 flex flex-row">
                <Pressable
                    className="w-16 h-9 flex flex-row items-center justify-start"
                    onPress={() => goBack()}
                >
                    <MoveLeft />
                </Pressable>
            </View>
            {children}
        </SafeAreaView>
    );
};

export default AuthLayout;
