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
  isDraft?: boolean;
}

export interface CreateDraftOrderDto {
  customerName?: string;
  customerPhone?: string;
  branchId: string;
  deskId?: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderDto {
  status?: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  customerName?: string;
  customerPhone?: string;
  deskId?: string;
  queueNumber?: number;
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

  // Draft order methods
  async createDraftOrder(data: CreateDraftOrderDto): Promise<Order> {
    return this.request<Order>('/orders/draft', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDraftOrders(branchId?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (branchId) params.append('branchId', branchId);
    params.append('status', 'DRAFT');
    const queryString = params.toString();
    return this.request<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async convertDraftToOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/convert`, {
      method: 'POST',
    });
  }

  // Print receipt placeholder
  async printReceipt(
    orderId: string, 
    paymentData?: {
      paymentMethod: 'cash' | 'cashless';
      receivedAmount?: number;
      changeAmount?: number;
    }
  ): Promise<{ success: boolean; message: string }> {
    // Placeholder function for printing receipt
    console.log(`Printing receipt for order: ${orderId}`, paymentData);
    
    // In a real implementation, this would:
    // 1. Format the order data for printing
    // 2. Include payment information (method, amounts)
    // 3. Send to thermal printer via native module
    // 4. Handle printer errors and status
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Receipt printed successfully'
        });
      }, 1000); // Simulate printing delay
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
