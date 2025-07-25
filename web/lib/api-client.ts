// API Client for POS Backend Integration

export interface ApiResponse<T = any> {
  data?: T | null;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER';
  primaryBranchId?: string;
  branches?: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  isActive: boolean;
  primaryBranchId?: string;
  primaryBranch?: Branch;
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

export interface CreateStaffDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
  isActive?: boolean;
  primaryBranchId?: string;
}

export interface UpdateStaffDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
  isActive?: boolean;
  primaryBranchId?: string;
}

export interface CreateBranchDto {
  name: string;
  address: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateBranchDto {
  name?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = (typeof window !== 'undefined' && (window as any).ENV?.NEXT_PUBLIC_API_URL) || 'http://localhost:3001/api';
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('pos_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      console.log("Token set:", token);
      if (token) {
        localStorage.setItem('pos_token', token);
      } else {
        localStorage.removeItem('pos_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || `HTTP error! status: ${response.status}`,
          data: null,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        data: null,
      };
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response:", response);
    if (response.data?.accessToken) {
      this.setToken(response.data.accessToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile');
  }

  // Branches
  async getBranches(): Promise<ApiResponse<Branch[]>> {
    return this.request<Branch[]>('/branches');
  }

  async getBranch(id: string): Promise<ApiResponse<Branch>> {
    return this.request<Branch>(`/branches/${id}`);
  }

  async createBranch(branchData: CreateBranchDto): Promise<ApiResponse<Branch>> {
    return this.request<Branch>('/branches', {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
  }

  async updateBranch(id: string, branchData: UpdateBranchDto): Promise<ApiResponse<Branch>> {
    return this.request<Branch>(`/branches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(branchData),
    });
  }

  async deleteBranch(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/branches/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<ApiResponse<Category>> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Menu Items
  async getMenuItems(categoryId?: string): Promise<ApiResponse<MenuItem[]>> {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request<MenuItem[]>(`/menu-items${query}`);
  }

  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>(`/menu-items/${id}`);
  }

  async createMenuItem(menuItemData: CreateMenuItemDto): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>('/menu-items', {
      method: 'POST',
      body: JSON.stringify(menuItemData),
    });
  }

  async updateMenuItem(id: string, menuItemData: UpdateMenuItemDto): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>(`/menu-items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(menuItemData),
    });
  }

  async deleteMenuItem(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/menu-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Desks
  async getDesks(branchId?: string): Promise<ApiResponse<Desk[]>> {
    const query = branchId ? `?branchId=${branchId}` : '';
    return this.request<Desk[]>(`/desks${query}`);
  }

  async getDesk(id: string): Promise<ApiResponse<Desk>> {
    return this.request<Desk>(`/desks/${id}`);
  }

  async createDesk(deskData: CreateDeskDto): Promise<ApiResponse<Desk>> {
    return this.request<Desk>('/desks', {
      method: 'POST',
      body: JSON.stringify(deskData),
    });
  }

  async updateDesk(id: string, deskData: UpdateDeskDto): Promise<ApiResponse<Desk>> {
    return this.request<Desk>(`/desks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(deskData),
    });
  }

  async deleteDesk(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/desks/${id}`, {
      method: 'DELETE',
    });
  }

  async regenerateDeskQR(id: string): Promise<ApiResponse<Desk>> {
    return this.request<Desk>(`/desks/${id}/regenerate-qr`, {
      method: 'POST',
    });
  }

  // Orders
  async getOrders(branchId?: string, status?: string): Promise<ApiResponse<Order[]>> {
    const params = new URLSearchParams();
    if (branchId) params.append('branchId', branchId);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    return this.request<Order[]>(`/orders${query}`);
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderDto): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Staff
  async getStaff(branchId?: string): Promise<ApiResponse<Staff[]>> {
    const params = new URLSearchParams();
    if (branchId) params.append('branchId', branchId);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    return this.request<Staff[]>(`/staff${query}`);
  }

  async getStaffMember(id: string): Promise<ApiResponse<Staff>> {
    return this.request<Staff>(`/staff/${id}`);
  }

  async createStaff(staffData: CreateStaffDto): Promise<ApiResponse<Staff>> {
    return this.request<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  }

  async updateStaff(id: string, staffData: UpdateStaffDto): Promise<ApiResponse<Staff>> {
    return this.request<Staff>(`/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(staffData),
    });
  }

  async deleteStaff(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/staff/${id}`, {
      method: 'DELETE',
    });
  }

  // Test Data (Development only)
  async getTestData(): Promise<ApiResponse<{
    branches: Branch[];
    desks: Desk[];
    menuItems: MenuItem[];
    users: User[];
  }>> {
    const [branches, desks, menuItems, users] = await Promise.all([
      this.request<Branch[]>('/test/branches'),
      this.request<Desk[]>('/test/desks'),
      this.request<MenuItem[]>('/test/menu-items'),
      this.request<User[]>('/test/users'),
    ]);

    return {
      data: {
        branches: branches.data || [],
        desks: desks.data || [],
        menuItems: menuItems.data || [],
        users: users.data || [],
      },
    };
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export the client instance and types
export default apiClient;
