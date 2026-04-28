import { ThemeColors } from "@/constants/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: "primary" | "secondary" | "outline";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = "primary",
    size = "medium",
    disabled = false,
    style,
    textStyle,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return ThemeColors.lightGray;
        switch (variant) {
            case "primary":
                return ThemeColors.foreground; // Using foreground color as button background
            case "secondary":
                return ThemeColors.accentGreen;
            case "outline":
                return "transparent";
            default:
                return ThemeColors.foreground;
        }
    };

    const getBorderColor = () => {
        if (variant === "outline") return ThemeColors.foreground;
        return "transparent";
    };

    const getTextColor = () => {
        if (variant === "outline") return ThemeColors.foreground;
        return "#ffffff";
    };

    const getPadding = () => {
        switch (size) {
            case "small":
                return { paddingVertical: 8, paddingHorizontal: 12 };
            case "medium":
                return { paddingVertical: 12, paddingHorizontal: 24 };
            case "large":
                return { paddingVertical: 16, paddingHorizontal: 32 };
            default:
                return { paddingVertical: 12, paddingHorizontal: 24 };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case "small":
                return 12;
            case "medium":
                return 14;
            case "large":
                return 16;
            default:
                return 14;
        }
    };

    const styles = StyleSheet.create({
        button: {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === "outline" ? 2 : 0,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
            ...getPadding(),
        },
        text: {
            color: getTextColor(),
            fontSize: getFontSize(),
            fontWeight: "600",
        },
    });

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};
