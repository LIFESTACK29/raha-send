import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WalletCard } from "../../../components/WalletCard";
import { useWalletStore } from "../../../store/useWalletStore";
import { FundWalletModal } from "../components/FundWalletModal";
import { WalletEmptyState } from "../components/WalletEmptyState";

export const WalletHomeScreen = () => {
  const {
    hasWallet,
    walletStatus,
    balance,
    accountPreview,
    fundingDetails,
    fundModalVisible,
    loading,
    error,
    transactions,
    fetchWalletStatus,
    createWallet,
    openFundModal,
    closeFundModal,
    fetchWalletBalance,
    fetchTransactions,
    refreshWallet,
  } = useWalletStore();

  console.log(fundingDetails)

  useFocusEffect(
    useCallback(() => {
      fetchWalletStatus();
      fetchTransactions(1);
    }, [])
  );

  const handleCreateWallet = async () => {
    try {
      await createWallet();
      Alert.alert("Success", "Wallet created successfully");
    } catch (err: any) {
      Alert.alert("Error", err.toString() || "Failed to create wallet");
    }
  };

  const handleFundWallet = async () => {
    openFundModal();
    try {
      await fetchWalletBalance();
    } catch (err: any) {
      // Error handled by store, modal will show error state
    }
  };

  const onRefresh = useCallback(() => {
    refreshWallet();
  }, [refreshWallet]);

  if (walletStatus === "loading" && !hasWallet && !error) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#01656c" />
      </View>
    );
  }

  if (!hasWallet || walletStatus === "not_created") {
    return (
      <WalletEmptyState
        onCreateWallet={handleCreateWallet}
        loading={loading}
      />
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View className="px-5 mt-4">
          <Text className="text-xl mb-4 font-walsheim-bold">My Wallet</Text>
          <WalletCard balance={balance} accountPreview={accountPreview} onTopUp={handleFundWallet} />

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-6 gap-3">
            <TouchableOpacity
              onPress={handleFundWallet}
              className="flex-1 bg-white border border-gray-200 rounded-xl py-3 items-center"
            >
              <Ionicons name="add-circle-outline" size={24} color="#01656c" />
              <Text className="text-sm font-walsheim-bold text-foreground mt-1">
                Fund
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-xl py-3 items-center">
              <Ionicons name="arrow-up-circle-outline" size={24} color="#01656c" />
              <Text className="text-sm font-walsheim-bold text-foreground mt-1">
                Withdraw
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-xl py-3 items-center">
              <Ionicons name="swap-horizontal-outline" size={24} color="#01656c" />
              <Text className="text-sm font-walsheim-bold text-foreground mt-1">
                Transfer
              </Text>
            </TouchableOpacity>
          </View>

          {/* Transactions Section */}
          <View className="mt-8 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-walsheim-bold text-foreground">
                Recent Transactions
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-[#01656c] font-walsheim-bold">
                  View all
                </Text>
              </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
              <View className="py-10 items-center justify-center border border-gray-100 rounded-2xl border-dashed">
                <Ionicons name="receipt-outline" size={32} color="#ccc" className="mb-2" />
                <Text className="text-gray-400 font-walsheim">No transactions yet</Text>
              </View>
            ) : (
              <View className="gap-3">
                {transactions.map((tx) => (
                  <View
                    key={tx.id}
                    className="flex-row items-center justify-between border-b border-gray-100 pb-3"
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center ${tx.type === "credit" ? "bg-green-100" : "bg-red-100"
                          }`}
                      >
                        <Ionicons
                          name={tx.type === "credit" ? "arrow-down" : "arrow-up"}
                          size={18}
                          color={tx.type === "credit" ? "#00A86B" : "#ef4444"}
                        />
                      </View>
                      <View>
                        <Text className="text-sm font-walsheim-bold text-foreground">
                          {tx.description || (tx.type === "credit" ? "Wallet Fund" : "Withdrawal")}
                        </Text>
                        <Text className="text-xs text-gray-blue font-walsheim mt-0.5">
                          {new Date(tx.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`text-sm font-walsheim-bold ${tx.type === "credit" ? "text-green-600" : "text-foreground"
                        }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <FundWalletModal
        visible={fundModalVisible}
        onClose={closeFundModal}
        loading={loading && !fundingDetails}
        fundingDetails={fundingDetails}
      />
    </View>
  );
};
