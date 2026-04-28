export type WalletStatus = "loading" | "not_created" | "active" | "error";

export interface AccountPreview {
  maskedAccountNumber: string;
  last4: string;
  bankName: string;
  accountName: string;
}

export interface Wallet {
  id: string;
  balance: number;
  balanceInNaira?: number;
  accountPreview?: AccountPreview;
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
}

export interface WalletStatusResponse {
  hasWallet: boolean;
  walletStatus: WalletStatus;
  cta?: string;
  wallet?: Wallet;
}

export interface CreateWalletResponse {
  message: string;
  wallet: Wallet;
}

export interface WalletBalanceResponse {
  wallet: Wallet;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
  reference: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface WalletStoreState {
  walletStatus: WalletStatus;
  hasWallet: boolean;
  balance: number;
  balanceInNaira: number;
  accountPreview?: AccountPreview;
  fundingDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  fundModalVisible: boolean;
  loading: boolean;
  error?: string;
  transactions: Transaction[];
  
  // Actions
  fetchWalletStatus: () => Promise<void>;
  createWallet: () => Promise<void>;
  openFundModal: () => void;
  closeFundModal: () => void;
  fetchWalletBalance: () => Promise<void>;
  fetchTransactions: (page?: number) => Promise<void>;
  refreshWallet: () => Promise<void>;
}
