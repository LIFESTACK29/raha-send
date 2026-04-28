import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/src/components/button";

interface WalletEmptyStateProps {
  onCreateWallet: () => void;
  loading: boolean;
}

export const WalletEmptyState: React.FC<WalletEmptyStateProps> = ({
  onCreateWallet,
  loading,
}) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <Ionicons name="wallet-outline" size={48} color="#01656c" />
      </View>
      
      <Text className="text-2xl font-walsheim-bold text-foreground mb-3 text-center">
        You don't have a wallet yet
      </Text>
      
      <Text className="text-base text-gray-blue text-center mb-8 font-walsheim">
        Create a wallet to easily fund your deliveries and receive payments seamlessly.
      </Text>

      <View className="w-full gap-4">
        <Button
          title={loading ? "Creating..." : "Create Wallet"}
          onPress={onCreateWallet}
          variant="primary"
          size="large"
          disabled={loading}
          style={{ borderRadius: 12, opacity: loading ? 0.7 : 1 }}
        />
        <Button
          title="Maybe Later"
          onPress={() => {}}
          variant="outline"
          size="large"
          style={{ borderRadius: 12 }}
        />
      </View>
    </View>
  );
};
