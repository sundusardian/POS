import { BaseApiClient } from './base-client';
import { ApiResponse } from './types/common';
import { 
  Ingredient, 
  Stock, 
  StockMovement,
  InventoryOverview,
  InventoryReport,
  CreateIngredientDto,
  UpdateIngredientDto,
  CreateStockDto,
  UpdateStockDto,
  CreateStockMovementDto
} from './types/inventory';

export class InventoryApiClient extends BaseApiClient {
  /**
   * Get inventory overview with key metrics
   */
  async getInventoryOverview(branchId?: string): Promise<ApiResponse<InventoryOverview>> {
    const endpoint = branchId 
      ? `/inventory/overview?branchId=${branchId}` 
      : '/inventory/overview';
    return this.request<InventoryOverview>(endpoint);
  }

  /**
   * Get detailed inventory report
   */
  async getInventoryReport(branchId?: string): Promise<ApiResponse<InventoryReport>> {
    const endpoint = branchId 
      ? `/inventory/report?branchId=${branchId}` 
      : '/inventory/report';
    return this.request<InventoryReport>(endpoint);
  }

  /**
   * Get all ingredients
   */
  async getIngredients(): Promise<ApiResponse<Ingredient[]>> {
    return this.request<Ingredient[]>('/ingredients');
  }

  /**
   * Get a specific ingredient by ID
   */
  async getIngredient(id: string): Promise<ApiResponse<Ingredient>> {
    return this.request<Ingredient>(`/ingredients/${id}`);
  }

  /**
   * Create a new ingredient
   */
  async createIngredient(ingredientData: CreateIngredientDto): Promise<ApiResponse<Ingredient>> {
    return this.request<Ingredient>('/ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredientData),
    });
  }

  /**
   * Update an existing ingredient
   */
  async updateIngredient(id: string, ingredientData: UpdateIngredientDto): Promise<ApiResponse<Ingredient>> {
    return this.request<Ingredient>(`/ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(ingredientData),
    });
  }

  /**
   * Delete an ingredient
   */
  async deleteIngredient(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all stocks, optionally filtered by branch and ingredient
   */
  async getStocks(branchId?: string, ingredientId?: string): Promise<ApiResponse<Stock[]>> {
    let endpoint = '/stocks';
    const params = new URLSearchParams();
    
    if (branchId) params.append('branchId', branchId);
    if (ingredientId) params.append('ingredientId', ingredientId);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return this.request<Stock[]>(endpoint);
  }

  /**
   * Get a specific stock by ID
   */
  async getStock(id: string): Promise<ApiResponse<Stock>> {
    return this.request<Stock>(`/stocks/${id}`);
  }

  /**
   * Create a new stock
   */
  async createStock(stockData: CreateStockDto): Promise<ApiResponse<Stock>> {
    return this.request<Stock>('/stocks', {
      method: 'POST',
      body: JSON.stringify(stockData),
    });
  }

  /**
   * Update an existing stock
   */
  async updateStock(id: string, stockData: UpdateStockDto): Promise<ApiResponse<Stock>> {
    return this.request<Stock>(`/stocks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(stockData),
    });
  }

  /**
   * Delete a stock
   */
  async deleteStock(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/stocks/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all stock movements, optionally filtered by stock ID and type
   */
  async getStockMovements(stockId?: string, type?: string): Promise<ApiResponse<StockMovement[]>> {
    let endpoint = '/stock-movements';
    const params = new URLSearchParams();
    
    if (stockId) params.append('stockId', stockId);
    if (type) params.append('type', type);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return this.request<StockMovement[]>(endpoint);
  }

  /**
   * Create a new stock movement
   */
  async createStockMovement(movementData: CreateStockMovementDto): Promise<ApiResponse<StockMovement>> {
    return this.request<StockMovement>('/stock-movements', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
  }
}

// Create a singleton instance
export const inventoryClient = new InventoryApiClient();
