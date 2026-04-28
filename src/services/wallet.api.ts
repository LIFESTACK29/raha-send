import { api } from "@/src/api/config";
import {
  WalletStatusResponse,
  CreateWalletResponse,
  WalletBalanceResponse,
  TransactionsResponse,
} from "../types/wallet.types";
import { AxiosError } from "axios";

export const walletService = {
  getWalletStatus: async (): Promise<WalletStatusResponse> => {
    try {
      const response = await api.get<WalletStatusResponse>("/wallet/status");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createWallet: async (): Promise<CreateWalletResponse> => {
    try {
      const response = await api.post<CreateWalletResponse>("/wallet/create");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getWalletBalance: async (): Promise<WalletBalanceResponse> => {
    try {
      const response = await api.get<WalletBalanceResponse>("/wallet/balance");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTransactions: async (page: number = 1, limit: number = 20): Promise<TransactionsResponse> => {
    try {
      const response = await api.get<TransactionsResponse>(`/wallet/transactions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};
