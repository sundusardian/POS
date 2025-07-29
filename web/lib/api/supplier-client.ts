import { BaseApiClient } from './base-client';
import { ApiResponse } from './types/common';
import { 
  Supplier, 
  SupplierIngredient, 
  PurchaseOrder,
  CreateSupplierDto,
  UpdateSupplierDto,
  CreateSupplierIngredientDto,
  UpdateSupplierIngredientDto,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto
} from './types/inventory';

export class SupplierApiClient extends BaseApiClient {
  /**
   * Get all suppliers
   */
  async getSuppliers(): Promise<ApiResponse<Supplier[]>> {
    return this.request<Supplier[]>('/suppliers');
  }

  /**
   * Get a specific supplier by ID
   */
  async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return this.request<Supplier>(`/suppliers/${id}`);
  }

  /**
   * Create a new supplier
   */
  async createSupplier(supplierData: CreateSupplierDto): Promise<ApiResponse<Supplier>> {
    return this.request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  }

  /**
   * Update an existing supplier
   */
  async updateSupplier(id: string, supplierData: UpdateSupplierDto): Promise<ApiResponse<Supplier>> {
    return this.request<Supplier>(`/suppliers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(supplierData),
    });
  }

  /**
   * Delete a supplier
   */
  async deleteSupplier(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all supplier ingredients, optionally filtered by supplier and ingredient
   */
  async getSupplierIngredients(supplierId?: string, ingredientId?: string): Promise<ApiResponse<SupplierIngredient[]>> {
    let endpoint = '/supplier-ingredients';
    const params = new URLSearchParams();
    
    if (supplierId) params.append('supplierId', supplierId);
    if (ingredientId) params.append('ingredientId', ingredientId);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return this.request<SupplierIngredient[]>(endpoint);
  }

  /**
   * Create a new supplier ingredient relation
   */
  async createSupplierIngredient(data: CreateSupplierIngredientDto): Promise<ApiResponse<SupplierIngredient>> {
    return this.request<SupplierIngredient>('/supplier-ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update an existing supplier ingredient relation
   */
  async updateSupplierIngredient(id: string, data: UpdateSupplierIngredientDto): Promise<ApiResponse<SupplierIngredient>> {
    return this.request<SupplierIngredient>(`/supplier-ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a supplier ingredient relation
   */
  async deleteSupplierIngredient(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/supplier-ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all purchase orders, optionally filtered by supplier, branch, and status
   */
  async getPurchaseOrders(supplierId?: string, branchId?: string, status?: string): Promise<ApiResponse<PurchaseOrder[]>> {
    let endpoint = '/purchase-orders';
    const params = new URLSearchParams();
    
    if (supplierId) params.append('supplierId', supplierId);
    if (branchId) params.append('branchId', branchId);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return this.request<PurchaseOrder[]>(endpoint);
  }

  /**
   * Get a specific purchase order by ID
   */
  async getPurchaseOrder(id: string): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>(`/purchase-orders/${id}`);
  }

  /**
   * Create a new purchase order
   */
  async createPurchaseOrder(data: CreatePurchaseOrderDto): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>('/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update an existing purchase order
   */
  async updatePurchaseOrder(id: string, data: UpdatePurchaseOrderDto): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>(`/purchase-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a purchase order
   */
  async deletePurchaseOrder(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/purchase-orders/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Update the status of a purchase order
   */
  async updatePurchaseOrderStatus(id: string, status: string): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>(`/purchase-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

// Create a singleton instance
export const supplierClient = new SupplierApiClient();
