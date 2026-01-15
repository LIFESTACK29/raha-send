import React from "react";
import {
    KeyboardTypeOptions,
    StyleSheet,
    Text,
    TextInput,
    View,
    Platform,
} from "react-native";

interface TextAreaProps {
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    autoCorrect?: boolean;
    value: string;
    setValue: (e: string) => void;
    label?: string;
    numberOfLines?: number; // Allows you to control the initial height
}

const CustomTextArea = ({
    keyboardType,
    placeholder,
    autoCorrect,
    value,
    setValue,
    label,
    numberOfLines = 4,
}: TextAreaProps) => {
    return (
        <View className="py-2">
            {label && (
                <Text className="text-foreground text-base font-medium mb-1 tracking-tight px-1.5">
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.textAreaContainer,
                    { height: numberOfLines * 24 + 40 }, // Dynamic height estimation
                ]}
            >
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    className="px-4 py-3 text-base text-gray-800"
                    value={value}
                    onChangeText={setValue}
                    keyboardType={keyboardType || "default"}
                    autoCapitalize="sentences"
                    autoCorrect={autoCorrect ?? true}
                    // Essential Multi-line Props
                    multiline={true}
                    numberOfLines={numberOfLines}
                    textAlignVertical="top" // Ensures text starts at the top on Android
                    spellCheck={true}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textAreaContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#D1D5DB",

        // iOS Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 3.5, // Moves shadow right
            height: 3, // Moves shadow down
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,

        // Android Shadow
        elevation: 2,

        // Prevent clipping of shadows
        marginHorizontal: 2,
        marginBottom: 4,
    },
});

export default CustomTextArea;
