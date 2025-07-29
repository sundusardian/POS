import { BaseApiClient } from './base-client';
import { ApiResponse, LoginResponse } from './types/common';
import { LoginRequest } from './types/auth';

export class AuthApiClient extends BaseApiClient {
  /**
   * Authenticate user and get access token
   */
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const loginData: LoginRequest = { email, password };
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  /**
   * Log out the current user by removing the token
   */
  async logout(): Promise<void> {
    this.setToken(null);
  }

  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile');
  }
}

// Create a singleton instance
export const authClient = new AuthApiClient();
