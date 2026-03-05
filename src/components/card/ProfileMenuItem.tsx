import React, { useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";

const ProfileMenuItem = ({
    icon: Icon,
    label,
    description,
    onPress,
    iconColor = "#022401",
    iconBg = "bg-light-gray/80",
    danger = false,
}: {
    icon: LucideIcon;
    label: string;
    description?: string;
    onPress?: () => void;
    iconColor?: string;
    iconBg?: string;
    danger?: boolean;
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 3,
            tension: 40,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                className="bg-white rounded-2xl px-4 py-3.5 mb-2.5 flex-row items-center"
                style={[
                    styles.cardShadow,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${iconBg}`}
                >
                    <Icon
                        size={17}
                        color={danger ? "#EF4444" : iconColor}
                        strokeWidth={1.8}
                    />
                </View>
                <View className="ml-3 flex-1">
                    <Text
                        className={`font-medium text-[14px] tracking-tight ${
                            danger ? "text-red-500" : "text-[#1A2F1A]"
                        }`}
                    >
                        {label}
                    </Text>
                    {description && (
                        <Text className="text-gray-400 text-[9px] mt-1">
                            {description}
                        </Text>
                    )}
                </View>
                {!danger && (
                    <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
                )}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        borderColor: "#D1D5DB40",
        borderWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default ProfileMenuItem;
