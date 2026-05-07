import { api } from './config';

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  verifyOTP: async (userId: string, code: string) => {
    const response = await api.post('/auth/verify-otp', { userId, code });
    return response.data;
  },
  resendOTP: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};

export const handleApiError = (error: any) => {
  if (!error.response) {
    return 'Check your internet connection';
  }
  return error.response.data.message || 'Something went wrong';
};
