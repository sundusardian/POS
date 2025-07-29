import { BaseApiClient } from './base-client';
import { ApiResponse } from './types/common';
import { Order, CreateOrderDto } from './types/orders';

export class OrderApiClient extends BaseApiClient {
  /**
   * Get all orders, optionally filtered by branch and status
   */
  async getOrders(branchId?: string, status?: string): Promise<ApiResponse<Order[]>> {
    let endpoint = '/orders';
    const params = new URLSearchParams();
    
    if (branchId) params.append('branchId', branchId);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return this.request<Order[]>(endpoint);
  }

  /**
   * Get a specific order by ID
   */
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderDto): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Update the status of an order
   */
  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Cancel an order
   */
  async cancelOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  }
}

// Create a singleton instance
export const orderClient = new OrderApiClient();
