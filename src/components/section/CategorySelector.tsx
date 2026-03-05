import { useState, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";

const categories = [
    "Food",
    "Clothes",
    "Gadgets",
    "Books",
    "Documents",
    "Medicine",
    "Other",
];

const CategorySelector = ({
    onSelect,
}: {
    onSelect?: (category: string) => void;
}) => {
    const [selected, setSelected] = useState("Food");

    const handleSelect = (item: string) => {
        setSelected(item);
        onSelect?.(item);
    };

    return (
        <View className="py-3 bg-[#F4F4F0]">
            <Text className="text-foreground text-lg font-semibold mb-4 tracking-[-0.15px] px-1.5">
                What are you sending?
            </Text>

            <View className="flex-row flex-wrap gap-3">
                {categories.map((item) => (
                    <CategoryPill
                        key={item}
                        label={item}
                        isSelected={selected === item}
                        onPress={() => handleSelect(item)}
                    />
                ))}
            </View>
        </View>
    );
};

// Sub-component to manage individual animation values
const CategoryPill = ({ label, isSelected, onPress }: any) => {
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
                onPressIn={() => animateScale(0.94)} // Slightly deeper zoom
                onPressOut={() => animateScale(1)}
                onPress={onPress}
                className={`px-6 py-2.5 rounded-full ${
                    isSelected ? "bg-foreground" : "bg-white"
                }`}
                style={{
                    shadowColor: "#0000000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                }}
            >
                <Text
                    className={`text-sm tracking-[-0.15px] font-semibold ${
                        isSelected ? "text-white" : "text-gray-500"
                    }`}
                >
                    {label}
                </Text>
            </Pressable>
        </Animated.View>
    );
};

export default CategorySelector;
