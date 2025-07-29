// Common types and interfaces used across all API modules

export interface ApiResponse<T = unknown> {
  data?: T | null;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER';
  primaryBranchId?: string;
  branches?: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
