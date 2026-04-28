import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Pressable,
    TextInput,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import { ThemeColors } from "@/constants/theme";

interface InputProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    editable?: boolean;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const Input: React.FC<InputProps> = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
    editable = true,
    style,
    inputStyle,
    onFocus,
    onBlur,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View 
            className={`flex-row items-center bg-[#f4f7f7] rounded-xl px-4 py-4 border-1.5 ${
                isFocused ? "border-accent-green" : "border-transparent"
            }`}
            style={style}
        >
            <TextInput
                className="flex-1 text-base font-medium text-text-color"
                style={inputStyle}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af" 
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                keyboardType={keyboardType}
                editable={editable}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoCapitalize="none"
            />
            {secureTextEntry && (
                <Pressable onPress={togglePasswordVisibility} className="ml-2">
                    <Ionicons 
                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color="#545454" 
                    />
                </Pressable>
            )}
        </View>
    );
};
