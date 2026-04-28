import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContactDetails } from "../types/delivery.types";

interface ContactDetailsSectionProps {
  /** Section title, e.g. "Sender Details" or "Receiver Details" */
  title: string;
  /** Current contact values */
  contact: ContactDetails;
  /** Called when any field changes */
  onChange: (updates: Partial<ContactDetails>) => void;
  /** Icon name for the section header */
  icon: keyof typeof Ionicons.glyphMap;
  /** Icon color */
  iconColor?: string;
  /** If true, show toggle for "Are you the sender?" */
  showSelfToggle?: boolean;
  /** Current toggle state */
  isSelf?: boolean;
  /** Called when toggle changes */
  onToggleSelf?: (isSelf: boolean) => void;
  /** Logged-in user info for auto-fill */
  loggedInUser?: { fullName: string; email: string; phoneNumber: string } | null;
}

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  title,
  contact,
  onChange,
  icon,
  iconColor = "#01656c",
  showSelfToggle = false,
  isSelf = false,
  onToggleSelf,
  loggedInUser,
}) => {
  const handleToggle = (value: boolean) => {
    onToggleSelf?.(value);
    if (value && loggedInUser) {
      // Auto-fill with logged-in user details
      onChange({
        fullName: loggedInUser.fullName,
        email: loggedInUser.email,
        phoneNumber: loggedInUser.phoneNumber,
      });
    } else if (!value) {
      // Clear fields when switching to manual input
      onChange({ fullName: "", email: "", phoneNumber: "" });
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Self Toggle (only for sender) */}
      {showSelfToggle && (
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Are you the one sending?</Text>
          <View style={styles.toggleButtons}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                isSelf && styles.toggleBtnActive,
              ]}
              onPress={() => handleToggle(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  isSelf && styles.toggleBtnTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                !isSelf && styles.toggleBtnActive,
              ]}
              onPress={() => handleToggle(false)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  !isSelf && styles.toggleBtnTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contact Fields */}
      {/* When isSelf is true AND toggle is showing, show read-only preview */}
      {showSelfToggle && isSelf && loggedInUser ? (
        <View style={styles.previewCard}>
          <View style={styles.previewRow}>
            <Ionicons name="person-outline" size={16} color="#6b7280" />
            <Text style={styles.previewText}>
              {loggedInUser.fullName || "—"}
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Ionicons name="mail-outline" size={16} color="#6b7280" />
            <Text style={styles.previewText}>
              {loggedInUser.email || "—"}
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Ionicons name="call-outline" size={16} color="#6b7280" />
            <Text style={styles.previewText}>
              {loggedInUser.phoneNumber || "—"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.fields}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="person-outline"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter full name"
                placeholderTextColor="#9ca3af"
                value={contact.fullName}
                onChangeText={(text) => onChange({ fullName: text })}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter email address"
                placeholderTextColor="#9ca3af"
                value={contact.email}
                onChangeText={(text) => onChange({ email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="call-outline"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 08012345678"
                placeholderTextColor="#9ca3af"
                value={contact.phoneNumber}
                onChangeText={(text) => onChange({ phoneNumber: text })}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "GTWalsheimPro-Bold",
    color: "#1f2937",
  },
  // Toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  toggleLabel: {
    fontSize: 13,
    fontFamily: "GTWalsheimPro-Medium",
    color: "#4b5563",
    flex: 1,
  },
  toggleButtons: {
    flexDirection: "row",
    gap: 6,
  },
  toggleBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  toggleBtnActive: {
    backgroundColor: "#022401",
    borderColor: "#022401",
  },
  toggleBtnText: {
    fontSize: 13,
    fontFamily: "GTWalsheimPro-Medium",
    color: "#6b7280",
  },
  toggleBtnTextActive: {
    color: "#ffffff",
  },
  // Preview card (read-only when self)
  previewCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  previewText: {
    fontSize: 14,
    fontFamily: "GTWalsheimPro",
    color: "#374151",
  },
  // Input fields
  fields: {
    gap: 12,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 12,
    fontFamily: "GTWalsheimPro",
    color: "#6b7280",
    marginBottom: 6,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f7f7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "GTWalsheimPro",
    color: "#1f2937",
  },
});
