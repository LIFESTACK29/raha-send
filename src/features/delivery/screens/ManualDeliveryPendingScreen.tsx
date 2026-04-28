import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useDeliveryStore } from "../store/useDeliveryStore";

export default function ManualDeliveryPendingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { delivery, resetDelivery } = useDeliveryStore();

  if (!delivery) {
    return null;
  }

  const handleDone = () => {
    resetDelivery();
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text" size={48} color="#01656c" />
            <View style={styles.badge}>
              <Ionicons name="time" size={20} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Delivery Created</Text>
        <Text style={styles.subtitle}>
          Your delivery has been created manually and is currently pending rider assignment.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
            <Text style={styles.infoText}>
              Our background worker is searching for nearby riders.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="notifications-outline" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>
              You will receive a notification as soon as a rider is assigned.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="headset-outline" size={20} color="#f59e0b" />
            <Text style={styles.infoText}>
              An admin can also manually assign a rider to your request.
            </Text>
          </View>
        </View>

        {/* Status Box */}
        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Pending Assignment</Text>
            </View>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Delivery ID</Text>
            <Text style={styles.statusValue}>#{delivery.id.slice(-8).toUpperCase()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
          <Text style={styles.doneBtnText}>Return to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#f59e0b",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontFamily: "GTWalsheimPro-Bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "GTWalsheimPro",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "GTWalsheimPro",
    color: "#4b5563",
    lineHeight: 20,
  },
  statusBox: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: "GTWalsheimPro",
    color: "#9ca3af",
  },
  statusValue: {
    fontSize: 15,
    fontFamily: "GTWalsheimPro-Bold",
    color: "#1f2937",
  },
  statusBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: "GTWalsheimPro-Bold",
    color: "#d97706",
  },
  statusDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 12,
  },
  doneBtn: {
    width: "100%",
    backgroundColor: "#022401",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  doneBtnText: {
    fontSize: 16,
    fontFamily: "GTWalsheimPro-Bold",
    color: "#ffffff",
  },
});
