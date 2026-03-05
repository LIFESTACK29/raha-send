import { View, Text, Pressable } from "react-native";
import { MoveRight } from "lucide-react-native";
import OnboardingLayout from "@/src/layouts/OnboardingLayout";
import GestureRecognizer from "react-native-swipe-gestures";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";

function OnboardingLayerTwoScreen() {
    const { navigate, goBack } = useNavigation<Nav>();

    return (
        <OnboardingLayout
            image={require("@/src/assets/images/onboarding-2.jpg")}
        >
            <GestureRecognizer
                onSwipeLeft={() => navigate("OnboardingLayerThree")}
                onSwipeRight={() => goBack()}
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <View className="absolute bottom-0 w-full rounded-t-[35px] bg-neutral-100 px-6 pt-6 pb-10">
                    <View className="flex-row justify-center mb-5 gap-1">
                        <View className="w-2 h-2 rounded-full bg-gray-300" />
                        <View className="w-8 h-2 rounded-full bg-orange-500" />
                        <View className="w-2 h-2 rounded-full bg-gray-300" />
                    </View>

                    <Text className="text-2xl tracking-tight font-semibold text-green-900 text-center">
                        No Haggling, No Drama
                    </Text>

                    <Text className="text-center text-sm tracking-tight text-green-800 mt-3 leading-6">
                        See the exact price before you book. Pay securely and
                        avoid the "Madam add money for fuel" stories.
                    </Text>

                    <Pressable
                        onPress={() => navigate("OnboardingLayerThree")}
                        className="mt-8 bg-foreground py-2 rounded-full flex-row justify-center items-center gap-2 h-16"
                    >
                        <Text className="text-white text-base font-medium">
                            Next
                        </Text>
                        <MoveRight color="white" size={20} />
                    </Pressable>

                    <View className="h-4" />
                </View>
            </GestureRecognizer>
        </OnboardingLayout>
    );
}

export default OnboardingLayerTwoScreen;
