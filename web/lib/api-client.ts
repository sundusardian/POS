// API Client for POS Backend Integration

// Inventory Management Interfaces
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

// Inventory DTOs
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
  async getTestData(): Promise<ApiResponse<{ branches: Branch[]; desks: Desk[]; menuItems: MenuItem[]; users: User[]; }>> {
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
      error: undefined,
    };
  }

  // Inventory Management
  async getInventoryOverview(branchId?: string): Promise<ApiResponse<InventoryOverview>> {
    const endpoint = branchId ? `/inventory/overview?branchId=${branchId}` : '/inventory/overview';
    return this.request(endpoint);
  }

  async getInventoryReport(branchId?: string): Promise<ApiResponse<InventoryReport>> {
    const endpoint = branchId ? `/inventory/report?branchId=${branchId}` : '/inventory/report';
    return this.request(endpoint);
  }

  // Ingredients
  async getIngredients(): Promise<ApiResponse<Ingredient[]>> {
    return this.request('/ingredients');
  }

  async getIngredient(id: string): Promise<ApiResponse<Ingredient>> {
    return this.request(`/ingredients/${id}`);
  }

  async createIngredient(ingredientData: CreateIngredientDto): Promise<ApiResponse<Ingredient>> {
    return this.request('/ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredientData),
    });
  }

  async updateIngredient(id: string, ingredientData: UpdateIngredientDto): Promise<ApiResponse<Ingredient>> {
    return this.request(`/ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(ingredientData),
    });
  }

  async deleteIngredient(id: string): Promise<ApiResponse<void>> {
    return this.request(`/ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  // Stock
  async getStocks(branchId?: string, ingredientId?: string): Promise<ApiResponse<Stock[]>> {
    let endpoint = '/stocks';
    const params = [];
    
    if (branchId) {
      params.push(`branchId=${branchId}`);
    }
    
    if (ingredientId) {
      params.push(`ingredientId=${ingredientId}`);
    }
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    return this.request(endpoint);
  }

  async getStock(id: string): Promise<ApiResponse<Stock>> {
    return this.request(`/stocks/${id}`);
  }

  async createStock(stockData: CreateStockDto): Promise<ApiResponse<Stock>> {
    return this.request('/stocks', {
      method: 'POST',
      body: JSON.stringify(stockData),
    });
  }

  async updateStock(id: string, stockData: UpdateStockDto): Promise<ApiResponse<Stock>> {
    return this.request(`/stocks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(stockData),
    });
  }

  async deleteStock(id: string): Promise<ApiResponse<void>> {
    return this.request(`/stocks/${id}`, {
      method: 'DELETE',
    });
  }

  // Stock Movements
  async getStockMovements(stockId?: string, type?: string): Promise<ApiResponse<StockMovement[]>> {
    let endpoint = '/stock-movements';
    const params = [];
    
    if (stockId) {
      params.push(`stockId=${stockId}`);
    }
    
    if (type) {
      params.push(`type=${type}`);
    }
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    return this.request(endpoint);
  }

  async createStockMovement(movementData: CreateStockMovementDto): Promise<ApiResponse<StockMovement>> {
    return this.request('/stock-movements', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
  }

  // Suppliers
  async getSuppliers(): Promise<ApiResponse<Supplier[]>> {
    return this.request('/suppliers');
  }

  async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return this.request(`/suppliers/${id}`);
  }

  async createSupplier(supplierData: CreateSupplierDto): Promise<ApiResponse<Supplier>> {
    return this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  }

  async updateSupplier(id: string, supplierData: UpdateSupplierDto): Promise<ApiResponse<Supplier>> {
    return this.request(`/suppliers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(supplierData),
    });
  }

  async deleteSupplier(id: string): Promise<ApiResponse<void>> {
    return this.request(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Supplier Ingredients
  getSupplierIngredients(supplierId?: string, ingredientId?: string): Promise<ApiResponse<SupplierIngredient[]>> {
    const params = new URLSearchParams();
    if (supplierId) params.append('supplierId', supplierId);
    if (ingredientId) params.append('ingredientId', ingredientId);
    
    const queryString = params.toString();
    return this.request<SupplierIngredient[]>(`/supplier-ingredients${queryString ? `?${queryString}` : ''}`);
  }

  createSupplierIngredient(data: CreateSupplierIngredientDto): Promise<ApiResponse<SupplierIngredient>> {
    return this.request<SupplierIngredient>('/supplier-ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateSupplierIngredient(id: string, data: UpdateSupplierIngredientDto): Promise<ApiResponse<SupplierIngredient>> {
    return this.request<SupplierIngredient>(`/supplier-ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteSupplierIngredient(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/supplier-ingredients/${id}`, {
      method: 'DELETE',
    });
  }
  
  // Purchase Orders
  getPurchaseOrders(supplierId?: string, branchId?: string, status?: string): Promise<ApiResponse<PurchaseOrder[]>> {
    const params = new URLSearchParams();
    if (supplierId) params.append('supplierId', supplierId);
    if (branchId) params.append('branchId', branchId);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    return this.request<PurchaseOrder[]>(`/purchase-orders${queryString ? `?${queryString}` : ''}`);
  }
  
  getPurchaseOrder(id: string): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>(`/purchase-orders/${id}`);
  }
  
  createPurchaseOrder(data: CreatePurchaseOrderDto): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>('/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  updatePurchaseOrder(id: string, data: UpdatePurchaseOrderDto): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>(`/purchase-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
  
  deletePurchaseOrder(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/purchase-orders/${id}`, {
      method: 'DELETE',
    });
  }
  
  updatePurchaseOrderStatus(id: string, status: string): Promise<ApiResponse<PurchaseOrder>> {
    return this.request<PurchaseOrder>(`/purchase-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export the client instance and types
export default apiClient;
