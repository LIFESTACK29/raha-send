import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { RideQuote } from "../types";

interface FarePreviewProps {
  quote: RideQuote | null;
  loading?: boolean;
  error?: string | null;
}

export const FarePreview: React.FC<FarePreviewProps> = ({ quote, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#01656c" />
        <Text style={styles.loadingText}>Getting fare...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!quote) return null;

  const canAfford = quote.availableBalance >= quote.fare;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Fare</Text>
        <Text style={styles.fare}>₦{quote.fareNaira.toLocaleString()}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Wallet balance</Text>
        <Text style={[styles.balance, !canAfford && styles.balanceInsufficient]}>
          ₦{quote.availableBalanceNaira.toLocaleString()}
        </Text>
      </View>
      {!canAfford && (
        <Text style={styles.shortfallText}>
          ₦{((quote.fare - quote.availableBalance) / 100).toLocaleString()} short — fund your wallet to continue
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  errorCard: { backgroundColor: "#fee2e2" },
  errorText: { color: "#991b1b", fontSize: 14, textAlign: "center" },
  loadingText: { color: "#9ca3af", fontSize: 14, marginTop: 8, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 14, color: "#545454" },
  fare: { fontSize: 20, fontWeight: "700", color: "#022401" },
  balance: { fontSize: 14, fontWeight: "600", color: "#01656c" },
  balanceInsufficient: { color: "#dc2626" },
  divider: { height: 1, backgroundColor: "#f1f1f1", marginVertical: 10 },
  shortfallText: { fontSize: 12, color: "#dc2626", marginTop: 8 },
});
