import React from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Button } from "@/src/components/button";

interface FundWalletModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  fundingDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}

export const FundWalletModal: React.FC<FundWalletModalProps> = ({
  visible,
  onClose,
  loading,
  fundingDetails,
}) => {
  const handleCopy = async () => {
    if (fundingDetails?.accountNumber) {
      await Clipboard.setStringAsync(fundingDetails.accountNumber);
      Alert.alert("Copied!", "Account number copied to clipboard.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-lg">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-walsheim-bold text-foreground">
              Fund Wallet
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
              <Ionicons name="close" size={24} color="#111" />
            </TouchableOpacity>
          </View>

          <Text className="text-base text-gray-blue font-walsheim mb-6">
            Transfer money to the account below to fund your wallet. It reflects
            automatically.
          </Text>

          {loading ? (
            <View className="py-10 items-center">
              <Text className="text-gray-blue font-walsheim">Loading details...</Text>
            </View>
          ) : fundingDetails ? (
            <View className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100">
              <View className="mb-4">
                <Text className="text-sm text-gray-500 font-walsheim mb-1">
                  Bank Name
                </Text>
                <Text className="text-base font-walsheim-bold text-foreground">
                  {fundingDetails.bankName}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-500 font-walsheim mb-1">
                  Account Name
                </Text>
                <Text className="text-base font-walsheim-bold text-foreground">
                  {fundingDetails.accountName}
                </Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500 font-walsheim mb-1">
                  Account Number
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-2xl font-walsheim-bold text-[#01656c] tracking-widest">
                    {fundingDetails.accountNumber}
                  </Text>
                  <TouchableOpacity
                    onPress={handleCopy}
                    className="bg-[#01656c]/10 p-2 rounded-full"
                  >
                    <Ionicons name="copy-outline" size={20} color="#01656c" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="py-10 items-center">
              <Text className="text-red-500 font-walsheim">
                Could not load account details.
              </Text>
            </View>
          )}

          <Button
            title="I have sent payment"
            onPress={onClose}
            variant="primary"
            size="large"
            style={{ borderRadius: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
};
