import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SplashScreen = () => {
    const { navigate } = useNavigation<Nav>();

    const redirect = useCallback(() => {
        try {
            setTimeout(() => {
                navigate("OnboardingLayerOne");
            }, 2500);
        } catch (error) {
            console.log("ERROR: ", error);
        }
    }, [navigate]);

    useEffect(() => {
        redirect();
    }, [redirect]);

    return (
        <SafeAreaView className="h-full bg-background">
            <ScrollView contentContainerClassName="h-full">
                <View className="h-full flex flex-col items-center justify-center">
                    <View className="h-auto">
                        <Image
                            source={require("../../assets/images/logo.png")}
                            className="h-[75px] w-36"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SplashScreen;
