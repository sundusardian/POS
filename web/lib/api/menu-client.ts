import { BaseApiClient } from './base-client';
import { ApiResponse } from './types/common';
import { 
  Category, 
  MenuItem, 
  CreateCategoryDto, 
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto
} from './types/menu';

export class MenuApiClient extends BaseApiClient {
  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  /**
   * Get a specific category by ID
   */
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  /**
   * Create a new category
   */
  async createCategory(categoryData: CreateCategoryDto): Promise<ApiResponse<Category>> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all menu items, optionally filtered by category
   */
  async getMenuItems(categoryId?: string): Promise<ApiResponse<MenuItem[]>> {
    const endpoint = categoryId 
      ? `/menu-items?categoryId=${categoryId}` 
      : '/menu-items';
    return this.request<MenuItem[]>(endpoint);
  }

  /**
   * Get a specific menu item by ID
   */
  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>(`/menu-items/${id}`);
  }

  /**
   * Create a new menu item
   */
  async createMenuItem(menuItemData: CreateMenuItemDto): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>('/menu-items', {
      method: 'POST',
      body: JSON.stringify(menuItemData),
    });
  }

  /**
   * Update an existing menu item
   */
  async updateMenuItem(id: string, menuItemData: UpdateMenuItemDto): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>(`/menu-items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(menuItemData),
    });
  }

  /**
   * Delete a menu item
   */
  async deleteMenuItem(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/menu-items/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
export const menuClient = new MenuApiClient();
