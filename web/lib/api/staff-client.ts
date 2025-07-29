import { BaseApiClient } from './base-client';
import { ApiResponse } from './types/common';
import { Staff, CreateStaffDto, UpdateStaffDto } from './types/staff';

export class StaffApiClient extends BaseApiClient {
  /**
   * Get all staff members, optionally filtered by branch
   */
  async getStaff(branchId?: string): Promise<ApiResponse<Staff[]>> {
    const endpoint = branchId 
      ? `/staff?branchId=${branchId}` 
      : '/staff';
    return this.request<Staff[]>(endpoint);
  }

  /**
   * Get a specific staff member by ID
   */
  async getStaffMember(id: string): Promise<ApiResponse<Staff>> {
    return this.request<Staff>(`/staff/${id}`);
  }

  /**
   * Create a new staff member
   */
  async createStaff(staffData: CreateStaffDto): Promise<ApiResponse<Staff>> {
    return this.request<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  }

  /**
   * Update an existing staff member
   */
  async updateStaff(id: string, staffData: UpdateStaffDto): Promise<ApiResponse<Staff>> {
    return this.request<Staff>(`/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(staffData),
    });
  }

  /**
   * Delete a staff member
   */
  async deleteStaff(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/staff/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
export const staffClient = new StaffApiClient();
