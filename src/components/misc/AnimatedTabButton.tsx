import { useRef } from "react";
import { Pressable, Animated } from "react-native";

const AnimatedTabButton = (props: any) => {
    const { children, onPress, onLongPress } = props; // accessibilityState

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92, // Scale down to 92%
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="flex-1 items-center justify-center"
        >
            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default AnimatedTabButton;
