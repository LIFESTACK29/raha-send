import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface DeliveryUpsellBannerProps {
  onTap?: () => void;
}

export const DeliveryUpsellBanner: React.FC<DeliveryUpsellBannerProps> = ({ onTap }) => {
  const router = useRouter();

  const handlePress = () => {
    onTap?.();
    router.push("/delivery/create" as any);
  };

  return (
    <TouchableOpacity style={styles.banner} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Ionicons name="cube-outline" size={22} color="#01656c" />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Need to send a package?</Text>
        <Text style={styles.subtitle}>Use SEND Delivery — fast, reliable door-to-door</Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color="#01656c" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0faf9",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#ccebe9",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f5f4",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700", color: "#022401" },
  subtitle: { fontSize: 12, color: "#545454", marginTop: 2 },
});
