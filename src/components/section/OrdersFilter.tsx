import { useState, useRef } from "react";
import { View, Text, Pressable, Animated, ScrollView } from "react-native";

const filters = ["All", "Ongoing", "Delivered", "Cancelled"];

const OrdersFilter = ({
    selected,
    onSelect,
}: {
    selected: string;
    onSelect: (filter: string) => void;
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-3"
            contentContainerStyle={{ gap: 10 }}
        >
            {filters.map((item) => (
                <FilterPill
                    key={item}
                    label={item}
                    isSelected={selected === item}
                    onPress={() => onSelect(item)}
                />
            ))}
        </ScrollView>
    );
};

const FilterPill = ({
    label,
    isSelected,
    onPress,
}: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
}) => {
    const scale = useRef(new Animated.Value(1)).current;

    const animateScale = (toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPressIn={() => animateScale(0.94)}
                onPressOut={() => animateScale(1)}
                onPress={onPress}
                className={`px-6 py-2 rounded-full ${
                    isSelected ? "bg-foreground" : "bg-white"
                }`}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 2,
                    elevation: 2,
                }}
            >
                <Text
                    className={`text-sm tracking-[-0.15px] font-semibold ${
                        isSelected ? "text-white" : "text-gray-400"
                    }`}
                >
                    {label}
                </Text>
            </Pressable>
        </Animated.View>
    );
};

export default OrdersFilter;
