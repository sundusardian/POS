// Token management utilities for React Native mobile app
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Helper function to get stored token
export async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem('auth_token');
  } else {
    return await SecureStore.getItemAsync('auth_token');
  }
}

// Helper function to store token
export async function storeToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem('auth_token', token);
  } else {
    await SecureStore.setItemAsync('auth_token', token);
  }
}

// Helper function to remove token
export async function removeStoredToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem('auth_token');
  } else {
    await SecureStore.deleteItemAsync('auth_token');
  }
}
