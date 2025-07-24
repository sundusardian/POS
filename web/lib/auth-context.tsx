"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiClient, User } from "./api-client";

interface AuthUser extends User {
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Define refreshAuth function with useCallback to prevent re-renders
  const refreshAuth = useCallback(async () => {
    const storedToken = apiClient.getToken();
    if (storedToken) {
      try {
        const response = await apiClient.getProfile();
        if (response.data) {
          const authUser: AuthUser = {
            ...response.data,
            avatar: `/avatars/${response.data.role.toLowerCase()}.png`
          };
          setUser(authUser);
          return true;
        }
      } catch (err) {
        console.error('Error refreshing auth:', err);
      }
    }
    return false;
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = apiClient.getToken();
        if (storedToken) {
          setToken(storedToken);
          
          // Try to get user profile with stored token
          const response = await apiClient.getProfile();
          if (response.data) {
            const authUser: AuthUser = {
              ...response.data,
              avatar: `/avatars/${response.data.role.toLowerCase()}.png`
            };
            setUser(authUser);
            console.log('Auth restored from token:', authUser.email);
          } else {
            // Token is invalid, clear it
            console.log('Stored token is invalid, clearing auth');
            apiClient.setToken(null);
            setToken(null);
            setUser(null);
          }
        } else {
          console.log('No stored token found');
        }
      } catch (err) {
        console.error('Error checking auth on mount:', err);
        // Only clear auth if it's an authentication error (401/403)
        if (err instanceof Error && (err.message.includes('401') || err.message.includes('403'))) {
          apiClient.setToken(null);
          setToken(null);
          setUser(null);
        }
        // For other errors (network issues), keep the token and try again later
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Refresh auth when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && user && token) {
        // Silently refresh auth when user returns to tab
        await refreshAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, token, refreshAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.login(email, password);
      
      if (response.data) {
        const authUser: AuthUser = {
          ...response.data.user,
          avatar: `/avatars/${response.data.user.role.toLowerCase()}.png`
        };
        
        setUser(authUser);
        setToken(response.data.accessToken);

      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.logout();
  };



  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    refreshAuth,
    isAuthenticated: !!user,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
