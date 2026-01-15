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
}: {
    text: string;
    action: () => void;
    type?: ButtonType;
    textClass?: string;
    className?: string;
    processing?: boolean;
}) => {
    return (
        <Pressable
            className={cn(
                "h-[4.1rem] flex items-center justify-center rounded-full bg-foreground mx-1",
                `${
                    type === "striped" &&
                    "border-[1.2px] border-foreground bg-[#F1662305]"
                }`,
                className,
                processing && "bg-foreground/10"
            )}
            onPress={action}
            disabled={processing}
        >
            {processing ? (
                <ActivityIndicator color={"#F16623"} />
            ) : (
                <Text
                    className={cn(
                        "text-center text-white font-medium text-lg tracking-[-0.15px]",
                        `${type === "striped" && "text-accent"}`,
                        textClass
                    )}
                >
                    {text}
                </Text>
            )}
        </Pressable>
    );
};

export default CustomButton;
