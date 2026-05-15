import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WalletCardProps {
  balance: number;
  accountPreview?: { bankName: string; last4: string };
  onTopUp?: () => void;
}

export const WalletCard = ({ balance, accountPreview, onTopUp }: WalletCardProps) => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <View
      className="rounded-2xl p-5 overflow-hidden relative"
      style={{ backgroundColor: "#bbcf8d" }}
    >
      {/* Watermark */}
      <Ionicons
        name="wallet-outline"
        size={160}
        color="rgba(1, 101, 108, 0.1)"
        style={{
          position: "absolute",
          right: -20,
          top: -30,
          transform: [{ rotate: "15deg" }],
        }}
      />

      {/* Top row */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-white/30 p-2 rounded-full">
          <Ionicons name="wallet-outline" size={20} color="#01656c" />
        </View>
        <View className="flex-row items-center gap-2">
          {accountPreview && (
            <View className="bg-white/40 px-3 py-1 rounded-full">
              <Text className="text-xs font-walsheim-bold text-[#01656c]">
                {accountPreview.bankName} • {accountPreview.last4}
              </Text>
            </View>
          )}
          {onTopUp && (
            <TouchableOpacity
              onPress={onTopUp}
              activeOpacity={0.75}
              className="bg-white/50 rounded-xl flex-row items-center gap-1"
              style={{ paddingHorizontal: 10, paddingVertical: 6 }}
            >
              <Ionicons name="add" size={13} color="#01656c" />
              <Text className="text-xs font-walsheim-bold text-[#01656c]">Top up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Balance */}
      <Text className="text-sm text-[#01656c] font-walsheim mb-1">Wallet Balance</Text>
      <View className="flex-row items-center gap-2">
        <Text className="text-[28px] font-walsheim-bold text-black leading-tight">
          {balanceVisible ? `₦${balance.toLocaleString()}` : "₦ ****"}
        </Text>
        <TouchableOpacity onPress={() => setBalanceVisible((v) => !v)}>
          <Ionicons
            name={balanceVisible ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="#01656c"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
