// Base API client for React Native mobile app
import { Platform } from 'react-native';
import { getStoredToken } from './token-manager';

// API base URL - adjust this to match your backend
// Use environment variables or default to localhost
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID || 'https://0smkq7sj-3001.asse.devtunnels.ms/api';

export const API_BASE_URL = Platform.OS === 'web' 
  ? API_URL 
  : API_URL_ANDROID; // Android emulator localhost

// Base API client class with core functionality
export class BaseApiClient {
  protected baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }

    console.log('Headers:', headers);
    
    
    return headers;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const config: RequestInit = {
      headers,
      ...options,
    };

    console.log(`API Request: ${config.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API Response: ${config.method || 'GET'} ${url} - Success`);
      return data;
    } catch (error) {
      console.error(`API Error: ${config.method || 'GET'} ${url}`, error);
      throw error;
    }
  }

  // Test connection endpoint
  async testConnection(): Promise<{ message: string; timestamp: string }> {
    return this.request<{ message: string; timestamp: string }>('/test');
  }
}
