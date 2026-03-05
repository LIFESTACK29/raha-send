import { useRef } from "react";
import { MessageCircle, Mail, Phone } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";

const supportActions = [
    {
        title: "Live Chat",
        description: "Chat with us",
        icon: MessageCircle,
        iconColor: "#f45900",
        bgColor: "bg-light-orange/55",
    },
    {
        title: "Email",
        description: "Send an email",
        icon: Mail,
        iconColor: "#022401",
        bgColor: "bg-accent-green/30",
    },
    {
        title: "Call Us",
        description: "Talk to support",
        icon: Phone,
        iconColor: "#022401",
        bgColor: "bg-light-gray/80",
    },
];

const SupportActionCard = () => {
    return (
        <View className="flex-row gap-x-3">
            {supportActions.map((action, index) => (
                <SupportCard key={index} action={action} />
            ))}
        </View>
    );
};

const SupportCard = ({ action }: { action: (typeof supportActions)[0] }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const animateScale = (toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const Icon = action.icon;

    return (
        <View className="flex-1">
            <Animated.View style={{ transform: [{ scale }] }}>
                <Pressable
                    onPressIn={() => animateScale(0.96)}
                    onPressOut={() => animateScale(1)}
                    className="w-full h-32 rounded-[20px] bg-white px-4 py-4"
                    style={styles.shadow}
                >
                    <View
                        className={`${action.bgColor} w-11 h-11 rounded-full flex items-center justify-center`}
                    >
                        <Icon
                            size={15}
                            color={action.iconColor}
                            strokeWidth={1.5}
                        />
                    </View>
                    <View className="mt-auto">
                        <Text className="text-[12.5px] font-semibold text-foreground tracking-tight">
                            {action.title}
                        </Text>
                        <Text className="text-[10px] tracking-tight font-normal text-gray-blue mt-0.5">
                            {action.description}
                        </Text>
                    </View>
                </Pressable>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        borderColor: "#D1D5DB80",
        borderWidth: 0.1,
        shadowColor: "#00000070",
        shadowOffset: { width: 3, height: 2.5 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 8,
    },
});

export default SupportActionCard;
