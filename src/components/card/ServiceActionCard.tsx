import { useRef } from "react";
import { Motorbike, Send } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";

const ServiceActionCard = () => {
    const { navigate } = useNavigation<Nav>();

    // 1. Initialize Animated values for both cards
    const scale1 = useRef(new Animated.Value(1)).current;
    const scale2 = useRef(new Animated.Value(1)).current;

    // 2. Animation helper function
    const animateScale = (value: Animated.Value, toValue: number) => {
        Animated.spring(value, {
            toValue,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    return (
        <View className="flex-row gap-x-3 px-5">
            {/* Quick Send Card */}
            <View className="flex-1">
                <Animated.View style={{ transform: [{ scale: scale1 }] }}>
                    <Pressable
                        onPressIn={() => animateScale(scale1, 0.96)} // Scale down
                        onPressOut={() => animateScale(scale1, 1)} // Scale back
                        className="w-full h-52 relative rounded-[30px] bg-white px-4 py-5"
                        style={styles.shadow}
                        onPress={() => navigate("QuickSend")}
                    >
                        <View>
                            <View className="bg-light-orange/55 w-14 h-14 rounded-full flex flex-row items-center justify-center">
                                <Send
                                    size={23}
                                    color={"#f45900"}
                                    strokeWidth={1.5}
                                />
                            </View>
                        </View>
                        <View className="p-1 flex flex-col gap-1.5 absolute bottom-0 py-6 mx-4">
                            <Text className="text-2xl font-bold text-foreground">
                                Quick Send
                            </Text>
                            <Text className="text-[0.82rem] tracking-tight font-normal text-gray-blue">
                                Fast and reliable delivery.
                            </Text>
                        </View>
                    </Pressable>
                </Animated.View>
            </View>

            {/* Courier Partners Card */}
            <View className="flex-1">
                <Animated.View style={{ transform: [{ scale: scale2 }] }}>
                    <Pressable
                        onPressIn={() => animateScale(scale2, 0.96)}
                        onPressOut={() => animateScale(scale2, 1)}
                        className="w-full h-52 relative rounded-[30px] bg-white px-4 py-5"
                        style={styles.shadow}
                    >
                        <View>
                            <View className="bg-light-gray/80 w-14 h-14 rounded-full flex flex-row items-center justify-center">
                                <Motorbike
                                    size={23}
                                    color={"#022401"}
                                    strokeWidth={1.5}
                                />
                            </View>
                        </View>
                        <View className="p-1 flex flex-col gap-1.5 absolute bottom-0 py-6 mx-3">
                            <Text className="text-2xl font-bold text-foreground leading-7">
                                Courier Partners
                            </Text>
                            <Text className="text-[0.79rem] tracking-tight font-normal text-gray-blue">
                                Choose from top logistics companies.
                            </Text>
                        </View>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        borderColor: "#D1D5DB80",
        borderWidth: 0.1,
        shadowColor: "#00000070",
        shadowOffset: { width: 3, height: 2.5 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 8,
    },
});

export default ServiceActionCard;
