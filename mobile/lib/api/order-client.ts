// Order API client
import { BaseApiClient } from './base-client';
import { Order, OrderItem } from './types';

export interface CreateOrderItemDto {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderDto {
  customerName?: string;
  customerPhone?: string;
  branchId: string;
  deskId?: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderDto {
  status?: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  customerName?: string;
  customerPhone?: string;
  deskId?: string;
}

export interface OrderFilters {
  branchId?: string;
  status?: string;
  customerName?: string;
  startDate?: string;
  endDate?: string;
}

export class OrderApiClient extends BaseApiClient {
  // Order endpoints
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const queryString = params.toString();
    return this.request<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<Order> {
    return this.request<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrder(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async completeOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/complete`, {
      method: 'PUT',
    });
  }

  // Order item endpoints
  async addOrderItem(orderId: string, data: CreateOrderItemDto): Promise<OrderItem> {
    return this.request<OrderItem>(`/orders/${orderId}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderItem(orderId: string, itemId: string, data: Partial<CreateOrderItemDto>): Promise<OrderItem> {
    return this.request<OrderItem>(`/orders/${orderId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeOrderItem(orderId: string, itemId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/orders/${orderId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }
}
