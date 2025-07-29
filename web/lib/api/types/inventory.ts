// Inventory management types and interfaces

import { User, Branch } from './common';

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  unit: string; // e.g., "kg", "liter", "pieces"
  category?: string; // e.g., "meat", "vegetables", "spices"
  isActive: boolean;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  stocks?: Stock[];
  suppliers?: SupplierIngredient[];
}

export interface Stock {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient;
  branchId: string;
  branch?: Branch;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  unitCost: number;
  expiryDate?: string;
  batchNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  stockId: string;
  stock?: Stock;
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'WASTE' | 'TRANSFER';
  quantity: number;
  reason?: string;
  reference?: string; // Order ID, supplier invoice, etc.
  userId?: string;
  user?: User;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ingredients?: SupplierIngredient[];
}

export interface SupplierIngredient {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  ingredientId: string;
  ingredient?: Ingredient;
  unitPrice: number;
  minOrderQty: number;
  leadTimeDays: number;
  isPreferred: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryOverview {
  totalIngredients: number;
  lowStockItems: number;
  expiringItems: number;
  totalStockValue: number;
}

export interface InventoryReport {
  ingredients: number;
  lowStockAlerts: number;
  expiringStock: number;
  recentMovements: StockMovement[];
  details: {
    lowStockItems: Stock[];
    expiringItems: Stock[];
  };
  lowStockItems: Stock[];
  expiringItems: Stock[];
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  branchId: string;
  branch?: Branch;
  status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  notes?: string;
  expectedDeliveryDate?: string;
  deliveredDate?: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseOrderItem[];
}

// DTOs for API requests
export interface CreateIngredientDto {
  name: string;
  description?: string;
  unit: string;
  category?: string;
  isActive?: boolean;
  unitPrice: number;
}

export interface UpdateIngredientDto {
  name?: string;
  description?: string;
  unit?: string;
  category?: string;
  isActive?: boolean;
  unitPrice?: number;
}

export interface CreateStockDto {
  ingredientId: string;
  branchId: string;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  unitCost: number;
  expiryDate?: string;
  batchNumber?: string;
}

export interface UpdateStockDto {
  quantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  unitCost?: number;
  expiryDate?: string;
  batchNumber?: string;
}

export interface CreateStockMovementDto {
  stockId: string;
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'WASTE' | 'TRANSFER';
  quantity: number;
  reason?: string;
  reference?: string;
}

export interface CreateSupplierDto {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateSupplierDto {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface CreateSupplierIngredientDto {
  supplierId: string;
  ingredientId: string;
  unitPrice: number;
  minOrderQty?: number;
  leadTimeDays?: number;
  isPreferred?: boolean;
}

export interface UpdateSupplierIngredientDto {
  unitPrice?: number;
  minOrderQty?: number;
  leadTimeDays?: number;
  isPreferred?: boolean;
}

export interface PurchaseOrderItemDto {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CreatePurchaseOrderDto {
  supplierId: string;
  branchId: string;
  expectedDeliveryDate?: string;
  notes?: string;
  items: PurchaseOrderItemDto[];
}

export interface UpdatePurchaseOrderDto {
  supplierId?: string;
  branchId?: string;
  status?: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  expectedDeliveryDate?: string;
  deliveredDate?: string;
  notes?: string;
  items?: PurchaseOrderItemDto[];
}
