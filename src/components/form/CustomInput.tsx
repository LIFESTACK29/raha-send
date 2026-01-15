import {
    KeyboardTypeOptions,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const CustomInput = ({
    keyboardType,
    placeholder,
    autoCorrect,
    value,
    setValue,
    label,
}: {
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions | undefined;
    autoCorrect?: boolean;
    value: string | number;
    setValue: (e: string) => void;
    inputClassName?: string;
    label?: string;
}) => {
    return (
        <View className="py-1">
            {label && (
                <Text className="text-foreground text-base font-semibold mb-1 tracking-[-0.15px] px-1.5">
                    {label}
                </Text>
            )}
            <View className="h-[4.5rem]" style={styles.inputContainer}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    className="px-5 flex flex-row items-center text-base text-gray-800 h-full leading-none pt-1.5"
                    value={String(value)}
                    onChangeText={(e) => setValue(e)}
                    keyboardType={keyboardType ? keyboardType : "default"}
                    autoCapitalize="none"
                    autoCorrect={autoCorrect ? autoCorrect : false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        // 1. You MUST have a background color for shadows to show
        backgroundColor: "#ffffff",
        borderRadius: 18,
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
        elevation: 2,

        // 4. Prevent clipping
        marginHorizontal: 2,
        marginBottom: 4,
    },
});

export default CustomInput;
