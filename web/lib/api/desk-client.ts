import { BaseApiClient } from './base-client';
import { ApiResponse } from './types/common';
import { Desk, CreateDeskDto, UpdateDeskDto } from './types/orders';

export class DeskApiClient extends BaseApiClient {
  /**
   * Get all desks, optionally filtered by branch
   */
  async getDesks(branchId?: string): Promise<ApiResponse<Desk[]>> {
    const endpoint = branchId 
      ? `/desks?branchId=${branchId}` 
      : '/desks';
    return this.request<Desk[]>(endpoint);
  }

  /**
   * Get a specific desk by ID
   */
  async getDesk(id: string): Promise<ApiResponse<Desk>> {
    return this.request<Desk>(`/desks/${id}`);
  }

  /**
   * Create a new desk
   */
  async createDesk(deskData: CreateDeskDto): Promise<ApiResponse<Desk>> {
    return this.request<Desk>('/desks', {
      method: 'POST',
      body: JSON.stringify(deskData),
    });
  }

  /**
   * Update an existing desk
   */
  async updateDesk(id: string, deskData: UpdateDeskDto): Promise<ApiResponse<Desk>> {
    return this.request<Desk>(`/desks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(deskData),
    });
  }

  /**
   * Delete a desk
   */
  async deleteDesk(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/desks/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Regenerate QR code for a desk
   */
  async regenerateDeskQR(id: string): Promise<ApiResponse<Desk>> {
    return this.request<Desk>(`/desks/${id}/regenerate-qr`, {
      method: 'POST',
    });
  }
}

// Create a singleton instance
export const deskClient = new DeskApiClient();
