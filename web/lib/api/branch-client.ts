import { BaseApiClient } from './base-client';
import { ApiResponse } from './types/common';
import { Branch, CreateBranchDto, UpdateBranchDto } from './types/branch';

export class BranchApiClient extends BaseApiClient {
  /**
   * Get all branches
   */
  async getBranches(): Promise<ApiResponse<Branch[]>> {
    return this.request<Branch[]>('/branches');
  }

  /**
   * Get a specific branch by ID
   */
  async getBranch(id: string): Promise<ApiResponse<Branch>> {
    return this.request<Branch>(`/branches/${id}`);
  }

  /**
   * Create a new branch
   */
  async createBranch(branchData: CreateBranchDto): Promise<ApiResponse<Branch>> {
    return this.request<Branch>('/branches', {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
  }

  /**
   * Update an existing branch
   */
  async updateBranch(id: string, branchData: UpdateBranchDto): Promise<ApiResponse<Branch>> {
    return this.request<Branch>(`/branches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(branchData),
    });
  }

  /**
   * Delete a branch
   */
  async deleteBranch(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/branches/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
export const branchClient = new BranchApiClient();
