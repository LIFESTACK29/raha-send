import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Easing,
    runOnJS,
} from "react-native-reanimated";
import { ChevronDown } from "lucide-react-native";
import { FAQItemType } from "@/src/data/faqItems";

const TIMING_CONFIG = {
    duration: 350,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
};

const FAQItem = ({ item }: { item: FAQItemType }) => {
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [measured, setMeasured] = useState(false);

    const progress = useSharedValue(0);
    const scale = useSharedValue(1);

    const onContentLayout = useCallback(
        (e: any) => {
            const height = e.nativeEvent.layout.height;
            if (height > 0 && !measured) {
                setContentHeight(height);
                setMeasured(true);
            }
        },
        [measured],
    );

    const toggleExpand = () => {
        const toExpanded = !expanded;
        setExpanded(toExpanded);

        progress.value = withTiming(toExpanded ? 1 : 0, TIMING_CONFIG);
    };

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    };

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const chevronStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg`,
            },
        ],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        height: interpolate(progress.value, [0, 1], [0, contentHeight || 100]),
        opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0, 1]),
        overflow: "hidden" as const,
    }));

    return (
        <Pressable
            onPress={toggleExpand}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                className="bg-white rounded-[18px] p-5 mb-4"
                style={[styles.cardShadow, containerStyle]}
            >
                <View className="flex-row items-center justify-between">
                    <Text className="text-[#1A2F1A] font-medium text-[14px] tracking-tight flex-1 pr-3">
                        {item.question}
                    </Text>
                    <Animated.View style={chevronStyle}>
                        <ChevronDown size={20} color="#9CA3AF" />
                    </Animated.View>
                </View>

                {/* Hidden measurer — renders offscreen to get natural height */}
                {!measured && (
                    <View
                        style={{
                            position: "absolute",
                            opacity: 0,
                            left: 16,
                            right: 16,
                        }}
                        onLayout={onContentLayout}
                    >
                        <Text className="text-gray-500 text-sm mt-3 leading-5 tracking-tight">
                            {item.answer}
                        </Text>
                    </View>
                )}

                {/* Animated content */}
                <Animated.View style={contentStyle}>
                    <Text className="text-gray-500 text-sm mt-3 leading-5 tracking-tight">
                        {item.answer}
                    </Text>
                </Animated.View>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        borderColor: "#D1D5DB80",
        borderWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
});

export default FAQItem;
