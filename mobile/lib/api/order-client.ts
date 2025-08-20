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
      method: 'PATCH',
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

  // Print receipt to thermal printer placeholder
  async printReceipt(
    orderId: string, 
    paymentData?: {
      paymentMethod: 'cash' | 'cashless';
      receivedAmount?: number;
      changeAmount?: number;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get order details for printing
      const order = await this.getOrder(orderId);
      
      // Format receipt data for thermal printer
      const receiptData = this.formatThermalReceipt(order, paymentData);
      
      // Placeholder for thermal printer integration
      console.log('=== THERMAL PRINTER OUTPUT ===');
      console.log(receiptData);
      console.log('=== END THERMAL PRINTER ===');
      
      // In a real implementation, this would:
      // 1. Use react-native-thermal-printer or similar package
      // 2. Connect to thermal printer via Bluetooth/USB/Network
      // 3. Send formatted ESC/POS commands
      // 4. Handle printer status and errors
      // Example: await ThermalPrinter.print(receiptData);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Receipt printed to thermal printer successfully'
          });
        }, 1500); // Simulate thermal printing delay
      });
    } catch (error) {
      console.error('Failed to print thermal receipt:', error);
      return {
        success: false,
        message: 'Failed to print receipt to thermal printer'
      };
    }
  }

  // Format receipt data for thermal printer (58mm width)
  private formatThermalReceipt(
    order: Order, 
    paymentData?: {
      paymentMethod: 'cash' | 'cashless';
      receivedAmount?: number;
      changeAmount?: number;
    }
  ): string {
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const centerText = (text: string, width: number = 32) => {
      const padding = Math.max(0, Math.floor((width - text.length) / 2));
      return ' '.repeat(padding) + text;
    };

    const leftRightText = (left: string, right: string, width: number = 32) => {
      const spaces = Math.max(1, width - left.length - right.length);
      return left + ' '.repeat(spaces) + right;
    };

    let receipt = '';
    
    // Header
    receipt += centerText('================================') + '\n';
    receipt += centerText(order.branch?.name || 'Restaurant Name') + '\n';
    receipt += centerText(order.branch?.address || 'Restaurant Address') + '\n';
    receipt += centerText('================================') + '\n';
    receipt += '\n';
    
    // Order Info
    receipt += leftRightText('Order #:', order.orderNumber) + '\n';
    if (order.queueNumber) {
      receipt += leftRightText('Queue #:', order.queueNumber.toString()) + '\n';
    }
    receipt += leftRightText('Date:', new Date(order.createdAt).toLocaleDateString('id-ID')) + '\n';
    receipt += leftRightText('Time:', new Date(order.createdAt).toLocaleTimeString('id-ID')) + '\n';
    if (order.customerName) {
      receipt += leftRightText('Customer:', order.customerName) + '\n';
    }
    if (order.deskId) {
      receipt += leftRightText('Table:', order.deskId) + '\n';
    }
    receipt += '--------------------------------\n';
    
    // Items
    order.orderItems.forEach(item => {
      receipt += `${item.quantity}x ${item.menuItem?.name || 'Item'}\n`;
      receipt += leftRightText('', formatPrice(item.unitPrice * item.quantity)) + '\n';
      if (item.notes) {
        receipt += `   Note: ${item.notes}\n`;
      }
    });
    
    receipt += '--------------------------------\n';
    receipt += leftRightText('TOTAL:', formatPrice(order.totalAmount)) + '\n';
    
    // Payment Info
    if (paymentData) {
      receipt += '\n';
      receipt += leftRightText('Payment:', paymentData.paymentMethod.toUpperCase()) + '\n';
      if (paymentData.paymentMethod === 'cash' && paymentData.receivedAmount) {
        receipt += leftRightText('Received:', formatPrice(paymentData.receivedAmount)) + '\n';
        if (paymentData.changeAmount) {
          receipt += leftRightText('Change:', formatPrice(paymentData.changeAmount)) + '\n';
        }
      }
    }
    
    // Footer
    receipt += '\n';
    receipt += centerText('Thank you for your order!') + '\n';
    receipt += centerText('Please come again') + '\n';
    receipt += '\n';
    receipt += centerText('================================') + '\n';
    
    return receipt;
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async completeOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/complete`, {
      method: 'PATCH',
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
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeOrderItem(orderId: string, itemId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/orders/${orderId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }
}
