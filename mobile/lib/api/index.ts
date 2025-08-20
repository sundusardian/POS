// Main API client that combines all feature clients
import { API_BASE_URL } from './base-client';
import { AuthApiClient } from './auth-client';
import { MenuApiClient } from './menu-client';
import { OrderApiClient } from './order-client';
import { BranchApiClient } from './branch-client';

// Combined API client class
export class ApiClient {
  public auth: AuthApiClient;
  public menu: MenuApiClient;
  public orders: OrderApiClient;
  public branches: BranchApiClient;

  constructor(baseURL: string) {
    this.auth = new AuthApiClient(baseURL);
    this.menu = new MenuApiClient(baseURL);
    this.orders = new OrderApiClient(baseURL);
    this.branches = new BranchApiClient(baseURL);
  }

  // Convenience method for testing connection
  async testConnection(): Promise<{ message: string; timestamp: string }> {
    return this.auth.testConnection();
  }
}

// Create and export the main API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Re-export all types and utilities
export * from './types';
export * from './token-manager';
export * from './auth-client';
export * from './menu-client';
export * from './order-client';
export * from './branch-client';

// Legacy exports for backward compatibility
export { apiClient as default };

// Convenience functions that maintain the old API structure
export const login = (credentials: any) => apiClient.auth.login(credentials);
export const register = (userData: any) => apiClient.auth.register(userData);
export const forgotPassword = (data: any) => apiClient.auth.forgotPassword(data);
export const validateToken = () => apiClient.auth.validateToken();
export const refreshToken = () => apiClient.auth.refreshToken();
export const testConnection = () => apiClient.testConnection();
