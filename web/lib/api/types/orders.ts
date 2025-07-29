// Order related types and interfaces

import { MenuItem } from './menu';
import { User, Branch } from './common';

export interface Desk {
  id: string;
  number: string;
  capacity: number;
  isActive: boolean;
  qrCode?: string;
  branchId: string;
  branch?: {
    name: string;
  };
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  menuItem: MenuItem;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deskId?: string;
  branchId: string;
  staffId?: string;
  orderItems: OrderItem[];
  desk?: Desk;
  branch: Branch;
  staff?: User;
  payment?: any;
}

// DTOs for API requests
export interface CreateDeskDto {
  number: string;
  capacity?: number;
  isActive?: boolean;
  qrCode?: string;
  branchId: string;
}

export interface UpdateDeskDto {
  number?: string;
  capacity?: number;
  isActive?: boolean;
  qrCode?: string;
}

export interface CreateOrderDto {
  customerName?: string;
  customerPhone?: string;
  deskId?: string;
  branchId: string;
  staffId?: string;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
    notes?: string;
  }[];
}
