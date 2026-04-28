import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NoRiderFoundPayload } from "../types/delivery.types";

interface NoRiderFoundSheetProps {
  visible: boolean;
  payload: NoRiderFoundPayload | null;
  onKeepWaiting: () => void;
  onCreateYourself: () => void;
  onClose: () => void;
}

export const NoRiderFoundSheet: React.FC<NoRiderFoundSheetProps> = ({
  visible,
  payload,
  onKeepWaiting,
  onCreateYourself,
  onClose,
}) => {
  if (!payload) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle indicator */}
          <View style={styles.handleBar} />

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="search-outline" size={36} color="#f59e0b" />
          </View>

          {/* Title */}
          <Text style={styles.title}>No Rider Found</Text>

          {/* Message */}
          <Text style={styles.message}>
            {payload.message ||
              "No rider accepted your delivery yet. You can continue waiting or create it yourself."}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.keepWaitingBtn}
              onPress={onKeepWaiting}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color="#374151"
                style={styles.btnIcon}
              />
              <Text style={styles.keepWaitingText}>Keep Waiting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createBtn}
              onPress={onCreateYourself}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#fff"
                style={styles.btnIcon}
              />
              <Text style={styles.createBtnText}>Create It Yourself</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "GTWalsheimPro-Bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: "GTWalsheimPro",
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  keepWaitingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  keepWaitingText: {
    fontSize: 15,
    fontFamily: "GTWalsheimPro-Medium",
    color: "#374151",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#022401",
  },
  createBtnText: {
    fontSize: 15,
    fontFamily: "GTWalsheimPro-Bold",
    color: "#ffffff",
  },
  btnIcon: {
    marginRight: 8,
  },
});
