import { View, Text, Pressable } from "react-native";
import { MoveRight } from "lucide-react-native";
import OnboardingLayout from "@/src/layouts/OnboardingLayout";
import GestureRecognizer from "react-native-swipe-gestures";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";

function OnboardingLayerOneScreen() {
    const { navigate } = useNavigation<Nav>();

    return (
        <OnboardingLayout
            image={require("@/src/assets/images/onboarding-1.jpg")}
        >
            <GestureRecognizer
                onSwipeLeft={() => navigate("OnboardingLayerTwo")}
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <View className="absolute bottom-0 w-full rounded-t-[35px] bg-neutral-100 px-6 pt-6 pb-10">
                    <View className="flex-row justify-center mb-5 gap-1">
                        <View className="w-8 h-2 rounded-full bg-orange-500" />
                        <View className="w-2 h-2 rounded-full bg-gray-300" />
                        <View className="w-2 h-2 rounded-full bg-gray-300" />
                    </View>

                    <Text className="text-2xl tracking-tight font-bold text-green-900 text-center">
                        Delivery without{" "}
                        <Text className="line-through text-green-900">
                            Wahala
                        </Text>
                    </Text>

                    <Text className="text-center text-base text-green-800 mt-3 leading-6">
                        Smart, reliable logistics for your everyday needs. Send
                        and receive packages anywhere with just a tap.
                    </Text>

                    <Pressable
                        onPress={() => navigate("OnboardingLayerTwo")}
                        className="mt-8 bg-foreground py-4 rounded-full flex-row justify-center items-center gap-2"
                    >
                        <Text className="text-white text-lg font-semibold">
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

export default OnboardingLayerOneScreen;
