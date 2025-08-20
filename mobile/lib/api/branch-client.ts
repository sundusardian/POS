// Branch API client
import { BaseApiClient } from './base-client';
import { Branch, Desk } from './types';

export interface CreateBranchDto {
  name: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateBranchDto {
  name?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

export interface CreateDeskDto {
  number: string;
  branchId: string;
  capacity: number;
  isAvailable?: boolean;
}

export interface UpdateDeskDto {
  number?: string;
  capacity?: number;
  isAvailable?: boolean;
}

export class BranchApiClient extends BaseApiClient {
  // Branch endpoints
  async getBranches(): Promise<Branch[]> {
    return this.request<Branch[]>('/branches');
  }

  async getBranch(id: string): Promise<Branch> {
    return this.request<Branch>(`/branches/${id}`);
  }

  async createBranch(data: CreateBranchDto): Promise<Branch> {
    return this.request<Branch>('/branches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBranch(id: string, data: UpdateBranchDto): Promise<Branch> {
    return this.request<Branch>(`/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBranch(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/branches/${id}`, {
      method: 'DELETE',
    });
  }

  // Desk endpoints
  async getDesks(branchId?: string): Promise<Desk[]> {
    const params = branchId ? `?branchId=${branchId}` : '';
    return this.request<Desk[]>(`/desks${params}`);
  }

  async getDesk(id: string): Promise<Desk> {
    return this.request<Desk>(`/desks/${id}`);
  }

  async createDesk(data: CreateDeskDto): Promise<Desk> {
    return this.request<Desk>('/desks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDesk(id: string, data: UpdateDeskDto): Promise<Desk> {
    return this.request<Desk>(`/desks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDesk(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/desks/${id}`, {
      method: 'DELETE',
    });
  }
}
