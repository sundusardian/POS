// Shared types and interfaces for API client

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  primaryBranchId?: string;
  primaryBranch?: {
    id: string;
    name: string;
  };
}

// Authentication DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// Branch interface
export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

// Menu interfaces
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  isAvailable: boolean;
}

// Order interfaces
export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  customerName?: string;
  customerPhone?: string;
  branchId: string;
  branch?: Branch;
  deskId?: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Staff interface
export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  primaryBranchId?: string;
  primaryBranch?: Branch;
  isActive: boolean;
}

// Desk interface
export interface Desk {
  id: string;
  number: string;
  branchId: string;
  branch?: Branch;
  capacity: number;
  isAvailable: boolean;
}
