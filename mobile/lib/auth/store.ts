import { create } from 'zustand';
import { apiClient, storeToken, removeStoredToken, getStoredToken, type User } from '../api';

// Re-export User type from api
export type { User } from '../api';

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

// Token management functions are now imported from api-client

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
      const token = await getStoredToken();
      if (token) {
        // Validate token with backend and fetch user data
        try {
          const user = await apiClient.auth.validateToken();
          set({ 
            token, 
            user,
            isLoading: false 
          });
        } catch (error) {
          // Token is invalid, remove it
          console.warn('Invalid token, removing:', error);
          await removeStoredToken();
          set({ token: null, user: null, isLoading: false });
        }
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
      // Make real API call to backend
      const response = await apiClient.auth.login({ email, password });
      console.log('Login response:', response.accessToken);
      // Store token securely
      await storeToken(JSON.stringify(response.accessToken));
      
      // Update auth state with user data and token
      set({
        token: response.accessToken,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Register action
  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      // Make real API call to backend
      const response = await apiClient.auth.register({ email, password, name });
      
      // Store token securely
      await storeToken(JSON.stringify(response.accessToken));
      
      // Update auth state with user data and token
      set({
        token: response.accessToken,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true });
    try {
      await removeStoredToken();
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
      // Make real API call to backend
      await apiClient.auth.forgotPassword({ email });
      
      // Reset request successful
      set({ isLoading: false });
      return Promise.resolve();
    } catch (error) {
      console.error('Password reset request failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed. Please try again.';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
