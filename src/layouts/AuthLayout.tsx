import { JSX } from "react";
import {
    Keyboard,
    Pressable,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MoveLeft } from "lucide-react-native";
import { Nav } from "../types";
import { useNavigation } from "@react-navigation/native";

const AuthLayout = ({
    children,
    disableBackButton,
}: {
    children: JSX.Element;
    disableBackButton?: boolean;
}) => {
    const { goBack } = useNavigation<Nav>();
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView className="h-full bg-background">
                <View className="px-5 flex flex-row">
                    {!disableBackButton && (
                        <Pressable
                            className="w-16 h-9 flex flex-row items-center justify-start"
                            onPress={() => goBack()}
                        >
                            <MoveLeft />
                        </Pressable>
                    )}
                </View>
                {children}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default AuthLayout;
