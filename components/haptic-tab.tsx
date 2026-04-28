import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export function HapticTab(props: BottomTabBarButtonProps) {
    const { onPress, ...rest } = props;

    // Filter out null values to match TouchableOpacityProps expectations
    const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([, value]) => value !== null),
    ) as TouchableOpacityProps;

    return (
        <TouchableOpacity
            {...filteredProps}
            onPress={(e) => {
                // Perform haptic feedback
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Call the original press handler
                onPress?.(e as any);
            }}
        />
    );
}
