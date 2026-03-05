import { useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { Camera } from "lucide-react-native";
import { useAtomValue } from "jotai";
import { userAtom } from "@/src/store/user";

const ProfileHeader = () => {
    const scale = useRef(new Animated.Value(1)).current;
    const user = useAtomValue(userAtom);

    const initials = user?.fullName
        ? user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "??";

    const animateScale = (toValue: number) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    return (
        <View className="items-center py-6">
            {/* Avatar */}
            <View className="relative mb-4">
                <View
                    className="w-24 h-24 rounded-full bg-foreground items-center justify-center"
                    style={styles.avatarShadow}
                >
                    <Text className="text-white text-3xl font-semibold">
                        {initials}
                    </Text>
                </View>
                <Pressable className="absolute bottom-0 right-0 w-9 h-9 bg-accent rounded-full items-center justify-center border-2 border-white">
                    <Camera size={14} color="#ffffff" strokeWidth={2} />
                </Pressable>
            </View>

            {/* Name & Email */}
            <Text className="text-foreground text-xl font-semibold tracking-tight">
                {user?.fullName || "User"}
            </Text>
            <Text className="text-gray-blue text-sm mt-1 tracking-tight font-medium">
                {user?.email || ""}
            </Text>

            {/* Edit Profile Button */}
            {/* <Animated.View style={{ transform: [{ scale }] }} className="mt-4">
                <Pressable
                    onPressIn={() => animateScale(0.96)}
                    onPressOut={() => animateScale(1)}
                    className="px-8 py-2.5 rounded-full bg-foreground"
                >
                    <Text className="text-white text-sm font-semibold tracking-tight">
                        Edit Profile
                    </Text>
                </Pressable>
            </Animated.View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    avatarShadow: {
        shadowColor: "#022401",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
});

export default ProfileHeader;
