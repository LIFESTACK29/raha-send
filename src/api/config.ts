import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = "https://send-api-1v9v.onrender.com/api/v1";


export const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60s to handle Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timed out');
    } else if (!error.response) {
      console.error('[API] Network error - no response received:', error.message);
    } else {
      console.error(`[API] ${error.response.status}: ${error.response.data?.message || error.message}`);
    }
    return Promise.reject(error);
  }
);
