import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://send-api-1v9v.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
