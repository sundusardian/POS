// Base API client with common functionality

import { ApiResponse } from './types/common';

export class BaseApiClient {
  protected baseUrl: string;
  protected token: string | null = null;

  constructor() {
    // Safely access window.ENV with proper type checking
    this.baseUrl = (() => {
      if (typeof window !== 'undefined') {
        // First cast window to unknown, then to a record type to avoid TypeScript errors
        const env = (window as unknown as { ENV?: { NEXT_PUBLIC_API_URL?: string } }).ENV;
        return env?.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      }
      return 'http://localhost:3001/api';
    })();
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('pos_token');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('pos_token', token);
      } else {
        localStorage.removeItem('pos_token');
      }
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Make API request with proper error handling
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          error: data.message || 'An error occurred',
          message: data.error || response.statusText
        };
      }

      return {
        data: data.data || data,
        message: data.message || 'Success'
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        error: 'Network error',
        message: error instanceof Error ? error.message : 'Failed to connect to server'
      };
    }
  }
}
