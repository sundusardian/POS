// Menu and category related types and interfaces

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API requests
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
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
}
