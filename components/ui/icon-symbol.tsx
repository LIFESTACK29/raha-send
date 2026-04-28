import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet } from "react-native";

interface IconSymbolProps {
    name: any;
    size?: number;
    color: string;
    style?: any;
}

export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
    return (
        <FontAwesome
            name={name}
            size={size}
            color={color}
            style={[styles.icon, style]}
        />
    );
}

const styles = StyleSheet.create({
    icon: {
        marginBottom: -3,
    },
});
