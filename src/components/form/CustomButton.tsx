import { cn } from "@/src/lib/utils";
import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonType = "default" | "striped";

const CustomButton = ({
    className,
    textClass,
    text,
    action,
    type,
    processing,
    disabled,
}: {
    text: string;
    action: () => void;
    type?: ButtonType;
    textClass?: string;
    className?: string;
    processing?: boolean;
    disabled?: boolean;
}) => {
    return (
        <Pressable
            className={cn(
                "h-[4rem] flex items-center justify-center rounded-full bg-foreground mx-1",
                `${
                    type === "striped" &&
                    "border-[1.2px] border-foreground bg-[#F1662305]"
                }`,
                className,
                processing && "bg-foreground/10",
                (disabled || processing) && "opacity-50",
            )}
            onPress={action}
            disabled={processing || disabled}
        >
            {processing ? (
                <ActivityIndicator color={"#F16623"} />
            ) : (
                <Text
                    className={cn(
                        "text-center text-white font-medium text-base tracking-[-0.15px]",
                        `${type === "striped" && "text-accent"}`,
                        textClass,
                    )}
                >
                    {text}
                </Text>
            )}
        </Pressable>
    );
};

export default CustomButton;
