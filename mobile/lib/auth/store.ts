import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
}

// Define auth state
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
  
  // Initialization
  initialize: () => Promise<void>;
}

// Helper function to store token securely
async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem('auth_token', token);
  } else {
    await SecureStore.setItemAsync('auth_token', token);
  }
}

// Helper function to get token
async function getToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem('auth_token');
  } else {
    return await SecureStore.getItemAsync('auth_token');
  }
}

// Helper function to remove token
async function removeToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('auth_token');
  } else {
    await SecureStore.deleteItemAsync('auth_token');
  }
}

// Create auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  error: null,

  // Initialize auth state
  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      if (token) {
        // In a real app, you would validate the token with your backend
        // and fetch the user data
        // For now, we'll just set a mock user
        set({ 
          token, 
          user: { 
            id: '1', 
            email: 'user@example.com', 
            name: 'Demo User' 
          },
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll just simulate a successful login
      // with a mock token and user
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials (in a real app, this would be done by your backend)
      if (email === 'user@example.com' && password === 'password') {
        const token = 'mock_token_' + Math.random().toString(36).substring(2);
        await saveToken(token);
        
        set({
          token,
          user: {
            id: '1',
            email,
            name: 'Demo User',
          },
          isLoading: false,
        });
      } else {
        set({ error: 'Invalid email or password', isLoading: false });
      }
    } catch (error) {
      console.error('Login failed:', error);
      set({ error: 'Login failed. Please try again.', isLoading: false });
    }
  },

  // Register action
  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll just simulate a successful registration
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      const token = 'mock_token_' + Math.random().toString(36).substring(2);
      await saveToken(token);
      
      set({
        token,
        user: {
          id: '1',
          email,
          name,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      set({ error: 'Registration failed. Please try again.', isLoading: false });
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true });
    try {
      await removeToken();
      set({ user: null, token: null, isLoading: false });
    } catch (error) {
      console.error('Logout failed:', error);
      set({ isLoading: false });
    }
  },

  // Forgot password action
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll just simulate a successful password reset request
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful password reset request
      set({ isLoading: false });
      return Promise.resolve();
    } catch (error) {
      console.error('Password reset request failed:', error);
      set({ error: 'Password reset request failed. Please try again.', isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
