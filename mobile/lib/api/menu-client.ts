// Menu API client
import { BaseApiClient } from './base-client';
import { Category, MenuItem } from './types';

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export class MenuApiClient extends BaseApiClient {
  // Category endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Menu item endpoints
  async getMenuItems(categoryId?: string): Promise<MenuItem[]> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request<MenuItem[]>(`/menu-items${params}`);
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    return this.request<MenuItem>(`/menu-items/${id}`);
  }

  async createMenuItem(data: CreateMenuItemDto): Promise<MenuItem> {
    return this.request<MenuItem>('/menu-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(id: string, data: UpdateMenuItemDto): Promise<MenuItem> {
    return this.request<MenuItem>(`/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/menu-items/${id}`, {
      method: 'DELETE',
    });
  }
}
