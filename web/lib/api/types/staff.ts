// Staff related types and interfaces

import { Branch } from './common';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  isActive: boolean;
  primaryBranchId?: string;
  primaryBranch?: Branch;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API requests
export interface CreateStaffDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
  isActive?: boolean;
  primaryBranchId?: string;
}

export interface UpdateStaffDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
  isActive?: boolean;
  primaryBranchId?: string;
}
