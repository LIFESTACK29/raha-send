import { create } from "zustand";

import { walletService } from "../services/wallet.api";
import { WalletStoreState } from "../types/wallet.types";

export const useWalletStore = create<WalletStoreState>((set, get) => ({
  walletStatus: "loading",
  hasWallet: false,
  balance: 0,
  balanceInNaira: 0,
  accountPreview: undefined,
  fundingDetails: undefined,
  fundModalVisible: false,
  loading: false,
  error: undefined,
  transactions: [],

  fetchWalletStatus: async () => {
    set({ loading: true, error: undefined });
    try {
      const response = await walletService.getWalletStatus();
      set({
        hasWallet: response.hasWallet,
        walletStatus: response.walletStatus,
        balance: response.wallet?.balance || 0,
        balanceInNaira: response.wallet?.balanceInNaira || 0,
        accountPreview: response.wallet?.accountPreview,
      });
    } catch (error: any) {
      set({ walletStatus: "error", error: error.toString() });
    } finally {
      set({ loading: false });
    }
  },

  createWallet: async () => {
    set({ loading: true, error: undefined });
    try {
      const response = await walletService.createWallet();
      set({
        hasWallet: true,
        walletStatus: "active",
        balance: response.wallet.balance,
        balanceInNaira: response.wallet.balanceInNaira || 0,
      });
      // Optionally refetch the full status to get masked preview etc.
      await get().fetchWalletStatus();
    } catch (error: any) {
      set({ error: error.toString() });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  openFundModal: () => set({ fundModalVisible: true }),
  closeFundModal: () => set({ fundModalVisible: false }),

  fetchWalletBalance: async () => {
    set({ loading: true, error: undefined });
    try {
      const response = await walletService.getWalletBalance();
      console.log('wallet',response)
      set({
        balance: response.wallet.balance,
        balanceInNaira: response.wallet.balanceInNaira || 0,
        fundingDetails: {
          accountNumber: response.wallet.accountNumber || "",
          bankName: response.wallet.bankName || "",
          accountName: response.wallet.accountName || "",
        },
      });
    } catch (error: any) {
      set({ error: error.toString() });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchTransactions: async (page = 1) => {
    set({ loading: true, error: undefined });
    try {
      const response = await walletService.getTransactions(page);
      set({ transactions: response.transactions });
    } catch (error: any) {
      set({ error: error.toString() });
    } finally {
      set({ loading: false });
    }
  },

  refreshWallet: async () => {
    await Promise.all([
      get().fetchWalletStatus(),
      get().fetchTransactions(1),
    ]);
  },
}));
