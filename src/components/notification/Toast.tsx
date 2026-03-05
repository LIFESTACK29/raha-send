import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    useSharedValue,
    withSequence,
    withDelay,
    Extrapolation,
    runOnJS,
} from "react-native-reanimated";
// 1. Import Gesture and GestureDetector
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useToast } from "@/src/context/ToastContext";
import type { Toast } from "@/src/context/ToastContext";
import SuccessIcon from "@/src/assets/icons/SuccessIcon";
import ErrorIcon from "@/src/assets/icons/ErrorIcon";
import WarningIcon from "@/src/assets/icons/WarningIcon";
import InfoIcon from "@/src/assets/icons/InfoIcon";
import { cn } from "@/src/lib/utils";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
    const { removeToast } = useToast();
    const { navigate } = useNavigation<Nav>();
    const entryProgress = useSharedValue(0);
    const scale = useSharedValue(0.5);
    const borderProgress = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);

    // Context for tracking gesture start position
    const context = useSharedValue({ x: 0, y: 0 });

    React.useEffect(() => {
        entryProgress.value = withSpring(1, {
            damping: 15,
            stiffness: 100,
            mass: 1,
        });

        scale.value = withSpring(1, {
            damping: 12,
            stiffness: 120,
            mass: 0.8,
        });

        borderProgress.value = withSequence(
            withDelay(150, withTiming(1, { duration: 300 })),
            withDelay(100, withTiming(1.2, { duration: 200 })),
            withTiming(1, { duration: 150 }),
        );
    }, []);

    // 2. Modern Gesture Definition
    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { x: translateX.value, y: translateY.value };
        })
        .onUpdate((event) => {
            translateX.value = event.translationX + context.value.x;
            translateY.value = event.translationY + context.value.y;
        })
        .onEnd((event) => {
            const distanceX = Math.abs(event.translationX);
            const distanceY = Math.abs(event.translationY);

            const dismiss = () => {
                translateX.value = withTiming(0);
                translateY.value = withTiming(-50);
                opacity.value = withTiming(0, {}, (finished) => {
                    if (finished) {
                        runOnJS(removeToast)(toast.id);
                    }
                });
            };

            if (distanceX > 100 || distanceY > 60) {
                dismiss();
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const containerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(entryProgress.value, [0, 0.4, 1], [0, 0.7, 1]),
        transform: [
            {
                translateY: interpolate(
                    entryProgress.value,
                    [0, 1],
                    [-100, 0],
                    Extrapolation.CLAMP,
                ),
            },
            { scale: scale.value },
        ],
    }));

    const gestureStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
        opacity: opacity.value,
    }));

    const borderStyle = useAnimatedStyle(() => ({
        borderTopWidth: interpolate(
            borderProgress.value,
            [0, 1],
            [0, 2],
            Extrapolation.CLAMP,
        ),
        borderRightWidth: interpolate(
            borderProgress.value,
            [0, 1],
            [0, 2],
            Extrapolation.CLAMP,
        ),
        borderColor:
            toast.type === "success"
                ? "#10b981"
                : toast.type === "error"
                  ? "#ef4444"
                  : toast.type === "warning"
                    ? "#f59e0b"
                    : toast.type === "info"
                      ? "#60a5fa"
                      : toast.type === "message"
                        ? toast.props?.theme === "dark"
                            ? "#ffffff20"
                            : "#00000010"
                        : toast.props?.theme === "dark"
                          ? "#ffffff"
                          : "#000000",
        borderRadius: 20,
    }));

    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <SuccessIcon size={{ width: "26", height: "26" }} />;
            case "error":
                return <ErrorIcon size={{ width: "22", height: "22" }} />;
            case "warning":
                return <WarningIcon size={{ width: "26", height: "26" }} />;
            case "info":
                return <InfoIcon size={{ width: "26", height: "26" }} />;
            default:
                return null;
        }
    };

    const ToastBody = (
        <Animated.View
            style={[containerStyle, gestureStyle]}
            className={cn(
                `px-4 py-3.5 rounded-[20px] shadow-xl mt-2 mb-2 mx-4 min-h-20 h-auto relative overflow-hidden flex flex-col gap-2 justify-center bg-white ${
                    toast.props?.theme === "dark" && "bg-[#222222]"
                }`,
            )}
        >
            <View className="flex flex-row items-center gap-4">
                <Pressable>{getIcon()}</Pressable>
                <Text
                    className={cn(
                        "text-[#222222] font-gtwp-condensed-bold tracking-wide text-[16px] xl:text-[20px] opacity-90 capitalize",
                        toast.props?.theme === "dark" && "text-white",
                    )}
                >
                    {toast.title.toLowerCase()}
                </Text>
            </View>
            {toast.message && (
                <View className="pl-2 pb-2">
                    <Text
                        className={cn(
                            "text-[#222222]/70 font-gtwp-condensed-medium tracking-tight text-[13px] leading-5",
                            toast.props?.theme === "dark" && "text-white",
                        )}
                    >
                        {toast.message.toLowerCase()}
                    </Text>
                </View>
            )}
            <Animated.View
                style={[
                    borderStyle,
                    {
                        position: "absolute",
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                        pointerEvents: "none",
                    },
                ]}
            />
        </Animated.View>
    );

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View>
                {toast.type === "message" ? (
                    <Animated.View
                        style={[containerStyle, gestureStyle]}
                        className="rounded-[35px] shadow-xl mt-4 mb-2 mx-4 min-h-16 h-auto relative overflow-hidden bg-[#111111]/40"
                    >
                        <BlurView
                            intensity={60}
                            tint="dark"
                            className="px-5 py-4 w-full h-20 flex flex-col gap-3 justify-center"
                        >
                            <Pressable
                                className="flex flex-row items-center gap-2.5"
                                onPress={() =>
                                    navigate("SingleChat", {
                                        groupId: toast.messageProps?.groupId,
                                    })
                                }
                            >
                                <View>
                                    <Image
                                        source={{
                                            uri: toast.messageProps?.image,
                                        }}
                                        className="w-8 h-8 rounded-full"
                                    />
                                </View>
                                <View>
                                    <Text className="font-gtwp-condensed-bold text-white tracking-wide text-base">
                                        {toast.messageProps?.identifierTitle}
                                    </Text>
                                    <Text className="text-[12px] mt-1 font-gtwp-condensed-medium tracking-tight text-white opacity-80">
                                        {toast.title}
                                    </Text>
                                </View>
                            </Pressable>
                        </BlurView>
                    </Animated.View>
                ) : (
                    ToastBody
                )}
            </Animated.View>
        </GestureDetector>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts } = useToast();
    if (!toasts.length) return null;

    return (
        <View className="absolute top-14 left-0 right-0 z-50">
            {toasts.map((toast: Toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </View>
    );
};

export default ToastItem;
