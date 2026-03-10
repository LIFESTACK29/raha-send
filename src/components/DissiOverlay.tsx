import React, { useRef, useState, useEffect } from "react";
import { View, Text, Pressable, Animated as RNAnimated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Mic, X, Loader2 } from "lucide-react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    cancelAnimation,
    withSpring,
} from "react-native-reanimated";
import { useDissi } from "../hooks/useDissi";

interface DissiOverlayProps {
    onOpenRiderModal: () => void;
}

export const DissiOverlay = ({ onOpenRiderModal }: DissiOverlayProps) => {
    const [expanded, setExpanded] = useState(false);
    const [isContinuousMode, setIsContinuousMode] = useState(false);
    const navigation = useNavigation();

    // Destructure the custom hook values
    const {
        isListening,
        isProcessing,
        transcript,
        aiResponse,
        error,
        startListening,
        stopListening,
        startContinuousListening,
        stopContinuousListening,
    } = useDissi(onOpenRiderModal, navigation);

    // Animations
    const pulseValue = useSharedValue(1);

    useEffect(() => {
        if (isProcessing) {
            pulseValue.value = withRepeat(
                withSequence(
                    withTiming(1.3, {
                        duration: 600,
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                    }),
                    withTiming(1, {
                        duration: 600,
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                    }),
                ),
                -1,
                true,
            );
        } else {
            cancelAnimation(pulseValue);
            pulseValue.value = withSpring(1);
        }
    }, [isProcessing]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }],
    }));

    const handleMicPress = () => {
        if (!expanded) {
            setExpanded(true);
        }

        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!expanded) {
        return (
            <View className="absolute bottom-24 right-6 z-50">
                <Animated.View style={pulseStyle}>
                    <Pressable
                        onPress={handleMicPress}
                        className="w-14 h-14 bg-foreground rounded-full items-center justify-center shadow-lg"
                        style={{
                            elevation: 5,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                        }}
                    >
                        <Mic color="#fff" size={24} />
                    </Pressable>
                </Animated.View>
            </View>
        );
    }

    return (
        <View
            className="absolute bottom-24 right-5 left-5 bg-white rounded-3xl p-5 shadow-2xl z-50"
            style={{
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
            }}
        >
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                    <Text className="text-foreground font-bold text-lg">
                        Dissi AI
                    </Text>
                    {isListening && (
                        <Text className="text-green-600 text-xs font-medium animate-pulse">
                            Listening...
                        </Text>
                    )}
                    {isProcessing && (
                        <Text className="text-blue-600 text-xs font-medium animate-pulse">
                            Processing...
                        </Text>
                    )}
                    {error && (
                        <Text className="text-red-500 text-xs font-medium">
                            {error}
                        </Text>
                    )}
                </View>

                <Pressable
                    onPress={() => setExpanded(false)}
                    className="bg-gray-100 p-2 rounded-full"
                >
                    <X color="#666" size={16} />
                </Pressable>
            </View>

            {/* Hands-free Toggle */}
            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <View>
                    <Text className="text-foreground font-medium text-sm">
                        Hands-free Mode
                    </Text>
                    <Text className="text-gray-500 text-xs">
                        Say "Hi Dissi"
                    </Text>
                </View>
                <Pressable
                    onPress={() => {
                        if (isContinuousMode) {
                            setIsContinuousMode(false);
                            stopContinuousListening();
                        } else {
                            setIsContinuousMode(true);
                            startContinuousListening();
                        }
                    }}
                    className={`w-12 h-6 rounded-full px-1 justify-center ${isContinuousMode ? "bg-foreground" : "bg-gray-300"}`}
                >
                    <View
                        className={`w-4 h-4 rounded-full bg-white transition-all ${isContinuousMode ? "self-end" : "self-start"}`}
                    />
                </Pressable>
            </View>

            {/* Transcripts area */}
            <View className="min-h-[80px] bg-gray-50 rounded-2xl p-4 mb-4 justify-center">
                {transcript ? (
                    <Text className="text-gray-800 text-base italic">
                        "{transcript}"
                    </Text>
                ) : (
                    <Text className="text-gray-400 text-sm italic text-center">
                        Tap mic to speak...
                    </Text>
                )}

                {aiResponse && !isProcessing && (
                    <Text className="text-foreground font-medium text-sm mt-3 border-t border-gray-200 pt-3">
                        🤖 {aiResponse}
                    </Text>
                )}
            </View>

            {/* Mic Toggle button container */}
            <View className="items-center justify-center">
                <Animated.View style={pulseStyle}>
                    <Pressable
                        onPress={handleMicPress}
                        className={`w-16 h-16 rounded-full items-center justify-center ${isListening && !isContinuousMode ? "bg-red-500" : "bg-foreground"}`}
                    >
                        {isProcessing ? (
                            <Loader2
                                color="#fff"
                                size={28}
                                className="animate-spin"
                            />
                        ) : (
                            <Mic color="#fff" size={28} />
                        )}
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
};
