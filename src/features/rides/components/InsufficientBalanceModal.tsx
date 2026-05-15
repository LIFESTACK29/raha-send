import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InsufficientBalanceData } from "../types";
import { useWalletStore } from "@/src/store/useWalletStore";

interface InsufficientBalanceModalProps {
  visible: boolean;
  onClose: () => void;
  data: InsufficientBalanceData | null;
}

export const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  const { openFundModal } = useWalletStore();

  const handleFund = () => {
    onClose();
    openFundModal();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.iconWrap}>
            <Ionicons name="wallet-outline" size={32} color="#dc2626" />
          </View>
          <Text style={styles.title}>Insufficient Balance</Text>
          <Text style={styles.subtitle}>
            Your wallet doesn't have enough funds for this ride.
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Fare required</Text>
              <Text style={styles.tableValue}>₦{data?.requiredNaira?.toLocaleString() ?? "—"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Current balance</Text>
              <Text style={styles.tableValue}>₦{data?.availableNaira?.toLocaleString() ?? "—"}</Text>
            </View>
            <View style={[styles.tableRow, styles.shortfallRow]}>
              <Text style={styles.shortfallLabel}>Shortfall</Text>
              <Text style={styles.shortfallValue}>₦{data?.shortfallNaira?.toLocaleString() ?? "—"}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.fundBtn} onPress={handleFund} activeOpacity={0.85}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.fundBtnText}>Fund Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.75}>
            <Text style={styles.cancelBtnText}>Not now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#022401" },
  subtitle: { fontSize: 14, color: "#545454", textAlign: "center" },
  table: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  shortfallRow: { backgroundColor: "#fee2e2", borderBottomWidth: 0 },
  tableLabel: { fontSize: 14, color: "#545454" },
  tableValue: { fontSize: 14, fontWeight: "600", color: "#022401" },
  shortfallLabel: { fontSize: 14, fontWeight: "600", color: "#991b1b" },
  shortfallValue: { fontSize: 14, fontWeight: "700", color: "#991b1b" },
  fundBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01656c",
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    gap: 8,
    marginTop: 8,
  },
  fundBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelBtn: { paddingVertical: 10 },
  cancelBtnText: { color: "#9ca3af", fontSize: 15 },
});
