import { useRef } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

const OTPInput = ({
    code,
    setCode,
    maximumLength = 6,
}: {
    code: string;
    setCode: (text: string) => void;
    maximumLength?: number;
}) => {
    const inputRef = useRef<TextInput>(null);

    // Boxes to map over
    const boxArray = new Array(maximumLength).fill(0);

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const boxDigit = (_: any, index: number) => {
        const digit = code[index] || "";

        return (
            <View
                key={index}
                style={styles.boxShadow}
                className="flex-1 h-[4rem] bg-[#F0F2F5] justify-center items-center"
            >
                <Text className="text-[#1A2F1A] text-2xl font-bold">
                    {digit}
                </Text>
            </View>
        );
    };

    return (
        <View className="justify-center items-center py-4">
            <Pressable
                // Reduced gap to accommodate 6 boxes
                className="flex-row justify-between w-full gap-x-2.5"
                onPress={handlePress}
            >
                {boxArray.map(boxDigit)}
            </Pressable>

            {/* Hidden input to handle keyboard and logic */}
            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={setCode}
                maxLength={maximumLength}
                keyboardType="number-pad"
                // Important: Use pointerEvents none so it doesn't block taps
                pointerEvents="none"
                className="absolute opacity-0"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    boxShadow: {
        backgroundColor: "#ffffff",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        // 2. iOS Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 3.5, // Moves shadow right
            height: 3, // Moves shadow down
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        // 3. Android Shadow
        elevation: 8,

        // 4. Prevent clipping
        marginHorizontal: 2,
        marginBottom: 4,
    },
});

export default OTPInput;
