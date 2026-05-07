import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/src/api/authService';
import { disconnectDeliverySocket } from '@/src/features/delivery/services/delivery.socket';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isOnboarded?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tempUserId: string | null;
  tempEmail: string | null;
  isInitialized: boolean;
  setAuth: (user: User, token: string) => void;
  setTempAuthData: (userId: string, email: string) => void;
  logout: () => Promise<void>;
  setInitialized: (init: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  tempUserId: null,
  tempEmail: null,
  isInitialized: false,
  setAuth: (user, token) => set({ user, token, tempUserId: null, tempEmail: null }),
  setTempAuthData: (userId, email) => set({ tempUserId: userId, tempEmail: email }),
  logout: async () => {
    try { await authService.logout(); } catch {}
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    disconnectDeliverySocket();
    set({ user: null, token: null });
  },
  setInitialized: (isInitialized) => set({ isInitialized }),
  setUser: (user) => set({ user }),
}));
