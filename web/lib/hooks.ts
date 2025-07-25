// Custom hooks for data fetching using SWR
import useSWR from 'swr';
import apiClient, { 
  ApiResponse, 
  Branch, 
  Category, 
  MenuItem, 
  Desk, 
  Order,
  User,
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  CreateOrderDto,
  CreateBranchDto,
  UpdateBranchDto,
  CreateDeskDto,
  UpdateDeskDto,
  // Inventory interfaces
  Ingredient,
  Stock,
  StockMovement,
  Supplier,
  SupplierIngredient,
  InventoryOverview,
  InventoryReport,
  // Inventory DTOs
  CreateIngredientDto,
  UpdateIngredientDto,
  CreateStockDto,
  UpdateStockDto,
  CreateStockMovementDto,
  CreateSupplierDto,
  UpdateSupplierDto,
  CreateSupplierIngredientDto,
  UpdateSupplierIngredientDto
} from './api-client';

// Hook for categories
export function useCategories() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Category[]>>(
    '/categories',
    () => apiClient.getCategories(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds
    }
  );

  return {
    categories: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

export function useCategory(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Category>>(
    id ? `/categories/${id}` : null,
    id ? () => apiClient.getCategory(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    category: data?.data || null,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for branches
export function useBranches() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Branch[]>>(
    '/branches',
    () => apiClient.getBranches(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds
    }
  );

  return {
    branches: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single branch
export function useBranch(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Branch>>(
    id ? `/branches/${id}` : null,
    id ? () => apiClient.getBranch(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    branch: data?.data || null,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for menu items
export function useMenuItems(categoryId?: string) {
  const key = categoryId ? `/menu-items?categoryId=${categoryId}` : '/menu-items';
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<MenuItem[]>>(
    key,
    () => apiClient.getMenuItems(categoryId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds
    }
  );

  return {
    menuItems: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single menu item
export function useMenuItem(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<MenuItem>>(
    id ? `/menu-items/${id}` : null,
    id ? () => apiClient.getMenuItem(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    menuItem: data?.data || null,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for desks
export function useDesks(branchId?: string) {
  const key = branchId ? `/desks?branchId=${branchId}` : '/desks';
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Desk[]>>(
    key,
    () => apiClient.getDesks(branchId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds
    }
  );

  return {
    desks: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single desk
export function useDesk(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Desk>>(
    id ? `/desks/${id}` : null,
    id ? () => apiClient.getDesk(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    desk: data?.data || null,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for orders
export function useOrders(branchId?: string, status?: string) {
  const params = new URLSearchParams();
  if (branchId) params.append('branchId', branchId);
  if (status) params.append('status', status);
  const key = `/orders${params.toString() ? `?${params.toString()}` : ''}`;
  
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Order[]>>(
    key,
    () => apiClient.getOrders(branchId, status),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 5000, // 5 seconds for orders
    }
  );

  return {
    orders: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single order
export function useOrder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/orders/${id}` : null,
    async () => {
      if (!id) return null;
      const response = await apiClient.getOrder(id);
      return response.data;
    }
  );

  return {
    order: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

// Hook for staff
export function useStaff(primaryBranchId?: string) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Staff[]>>(
    primaryBranchId ? `/staff?primaryBranchId=${primaryBranchId}` : '/staff',
    () => apiClient.getStaff(primaryBranchId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    staff: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single staff member
export function useStaffMember(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Staff>>(
    id ? `/staff/${id}` : null,
    id ? () => apiClient.getStaffMember(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    staffMember: data?.data,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for test data (development only)
export function useTestData() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<{
    branches: Branch[];
    desks: Desk[];
    menuItems: MenuItem[];
    users: User[];
  }>>(
    '/test-data',
    () => apiClient.getTestData(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    testData: data?.data || { branches: [], desks: [], menuItems: [], users: [] },
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Utility hook for order mutations (create, update, delete)
export function useOrderMutations() {
  const createOrder = async (orderData: CreateOrderDto) => {
    const response = await apiClient.createOrder(orderData);
    return response;
  };


  const updateOrderStatus = async (id: string, status: string) => {
    const response = await apiClient.updateOrderStatus(id, status);
    return response;
  };

  const cancelOrder = async (id: string) => {
    const response = await apiClient.cancelOrder(id);
    return response;
  };

  return {
    createOrder,
    updateOrderStatus,
    cancelOrder,
  };
}

// Utility hook for desk mutations (create, update, delete)
export function useDeskMutations() {
  const createDesk = async (deskData: CreateDeskDto) => {
    const response = await apiClient.createDesk(deskData);
    return response;
  };

  const updateDesk = async (id: string, deskData: Partial<UpdateDeskDto>) => {
    const response = await apiClient.updateDesk(id, deskData);
    return response;
  };

  const deleteDesk = async (id: string) => {
    const response = await apiClient.deleteDesk(id);
    return response;
  };

  const regenerateQR = async (id: string) => {
    const response = await apiClient.regenerateDeskQR(id);
    return response;
  };

  return {
    createDesk,
    updateDesk,
    deleteDesk,
    regenerateQR,
  };
}

// Utility hook for staff mutations (create, update, delete)
export function useStaffMutations() {
  const createStaff = async (staffData: CreateStaffDto) => {
    const response = await apiClient.createStaff(staffData);
    return response;
  };

  const updateStaff = async (id: string, staffData: UpdateStaffDto) => {
    const response = await apiClient.updateStaff(id, staffData);
    return response;
  };

  const deleteStaff = async (id: string) => {
    const response = await apiClient.deleteStaff(id);
    return response;
  };

  return {
    createStaff,
    updateStaff,
    deleteStaff,
  };
}

// Utility hook for branch mutations (create, update, delete)
export function useBranchMutations() {
  const { refetch } = useBranches();

  const createBranch = async (branchData: CreateBranchDto) => {
    const response = await apiClient.createBranch(branchData);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const updateBranch = async (id: string, branchData: UpdateBranchDto) => {
    const response = await apiClient.updateBranch(id, branchData);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const deleteBranch = async (id: string) => {
    const response = await apiClient.deleteBranch(id);
    refetch();
    return response;
  };

  return { createBranch, updateBranch, deleteBranch };
}

// ==================== INVENTORY MANAGEMENT HOOKS ====================

// Hook for inventory overview
export function useInventoryOverview(branchId?: string) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<InventoryOverview>>(
    branchId ? `/inventory/overview?branchId=${branchId}` : '/inventory/overview',
    () => apiClient.getInventoryOverview(branchId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // 1 minute
    }
  );

  return {
    overview: data?.data,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for inventory report
export function useInventoryReport(branchId?: string) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<InventoryReport>>(
    branchId ? `/inventory/report?branchId=${branchId}` : '/inventory/report',
    () => apiClient.getInventoryReport(branchId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // 1 minute
    }
  );

  return {
    report: data?.data,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for ingredients
export function useIngredients() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Ingredient[]>>(
    '/ingredients',
    () => apiClient.getIngredients(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds
    }
  );

  return {
    ingredients: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single ingredient
export function useIngredient(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Ingredient>>(
    id ? `/ingredients/${id}` : null,
    id ? () => apiClient.getIngredient(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    ingredient: data?.data,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for stocks
export function useStocks(branchId?: string, ingredientId?: string) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Stock[]>>(
    `/stocks${branchId || ingredientId ? '?' : ''}${branchId ? `branchId=${branchId}` : ''}${branchId && ingredientId ? '&' : ''}${ingredientId ? `ingredientId=${ingredientId}` : ''}`,
    () => apiClient.getStocks(branchId, ingredientId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds
    }
  );

  return {
    stocks: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single stock
export function useStock(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Stock>>(
    id ? `/stocks/${id}` : null,
    id ? () => apiClient.getStock(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    stock: data?.data,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for stock movements
export function useStockMovements(stockId?: string, type?: string) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<StockMovement[]>>(
    `/stock-movements${stockId || type ? '?' : ''}${stockId ? `stockId=${stockId}` : ''}${stockId && type ? '&' : ''}${type ? `type=${type}` : ''}`,
    () => apiClient.getStockMovements(stockId, type),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds
    }
  );

  return {
    movements: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for suppliers
export function useSuppliers() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Supplier[]>>(
    '/suppliers',
    () => apiClient.getSuppliers(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // 1 minute
    }
  );

  return {
    suppliers: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for a single supplier
export function useSupplier(id: string | null) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Supplier>>(
    id ? `/suppliers/${id}` : null,
    id ? () => apiClient.getSupplier(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    supplier: data?.data,
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Hook for supplier ingredients
export function useSupplierIngredients(supplierId?: string, ingredientId?: string) {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<SupplierIngredient[]>>(
    `/supplier-ingredients${supplierId || ingredientId ? '?' : ''}${supplierId ? `supplierId=${supplierId}` : ''}${supplierId && ingredientId ? '&' : ''}${ingredientId ? `ingredientId=${ingredientId}` : ''}`,
    () => apiClient.getSupplierIngredients(supplierId, ingredientId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // 1 minute
    }
  );

  return {
    supplierIngredients: data?.data || [],
    isLoading,
    error: data?.error || error,
    refetch,
  };
}

// Utility hook for ingredient mutations (create, update, delete)
export function useIngredientMutations() {
  const { refetch } = useIngredients();

  const createIngredient = async (ingredientData: CreateIngredientDto) => {
    const response = await apiClient.createIngredient(ingredientData);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const updateIngredient = async (id: string, ingredientData: UpdateIngredientDto) => {
    const response = await apiClient.updateIngredient(id, ingredientData);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const deleteIngredient = async (id: string) => {
    const response = await apiClient.deleteIngredient(id);
    refetch();
    return response;
  };

  return { createIngredient, updateIngredient, deleteIngredient };
}

// Utility hook for stock mutations (create, update, delete)
export function useStockMutations() {
  const { refetch: refetchStocks } = useStocks();
  const { refetch: refetchOverview } = useInventoryOverview();
  const { refetch: refetchReport } = useInventoryReport();

  const createStock = async (stockData: CreateStockDto) => {
    const response = await apiClient.createStock(stockData);
    if (response.data) {
      refetchStocks();
      refetchOverview();
      refetchReport();
    }
    return response;
  };

  const updateStock = async (id: string, stockData: UpdateStockDto) => {
    const response = await apiClient.updateStock(id, stockData);
    if (response.data) {
      refetchStocks();
      refetchOverview();
      refetchReport();
    }
    return response;
  };

  const deleteStock = async (id: string) => {
    const response = await apiClient.deleteStock(id);
    refetchStocks();
    refetchOverview();
    refetchReport();
    return response;
  };

  return { createStock, updateStock, deleteStock };
}

// Utility hook for stock movement mutations (create)
export function useStockMovementMutations() {
  const { refetch: refetchMovements } = useStockMovements();
  const { refetch: refetchStocks } = useStocks();
  const { refetch: refetchOverview } = useInventoryOverview();
  const { refetch: refetchReport } = useInventoryReport();

  const createStockMovement = async (movementData: CreateStockMovementDto) => {
    const response = await apiClient.createStockMovement(movementData);
    if (response.data) {
      refetchMovements();
      refetchStocks();
      refetchOverview();
      refetchReport();
    }
    return response;
  };

  return { createStockMovement };
}

// Utility hook for supplier mutations (create, update, delete)
export function useSupplierMutations() {
  const { refetch } = useSuppliers();

  const createSupplier = async (supplierData: CreateSupplierDto) => {
    const response = await apiClient.createSupplier(supplierData);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const updateSupplier = async (id: string, supplierData: UpdateSupplierDto) => {
    const response = await apiClient.updateSupplier(id, supplierData);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const deleteSupplier = async (id: string) => {
    const response = await apiClient.deleteSupplier(id);
    refetch();
    return response;
  };

  return { createSupplier, updateSupplier, deleteSupplier };
}

// Utility hook for supplier ingredient mutations (create, update, delete)
export function useSupplierIngredientMutations() {
  const { refetch } = useSupplierIngredients();

  const createSupplierIngredient = async (data: CreateSupplierIngredientDto) => {
    const response = await apiClient.createSupplierIngredient(data);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const updateSupplierIngredient = async (id: string, data: UpdateSupplierIngredientDto) => {
    const response = await apiClient.updateSupplierIngredient(id, data);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const deleteSupplierIngredient = async (id: string) => {
    const response = await apiClient.deleteSupplierIngredient(id);
    refetch();
    return response;
  };

  return { createSupplierIngredient, updateSupplierIngredient, deleteSupplierIngredient };
}

// Hook for purchase orders
export function usePurchaseOrders(supplierId?: string, branchId?: string, status?: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<PurchaseOrder[]>>(
    () => {
      const params = new URLSearchParams();
      if (supplierId) params.append('supplierId', supplierId);
      if (branchId) params.append('branchId', branchId);
      if (status) params.append('status', status);
      
      const queryString = params.toString();
      return `/purchase-orders${queryString ? `?${queryString}` : ''}`;
    },
    apiClient.fetcher
  );

  return {
    purchaseOrders: data?.data || [],
    isLoading,
    error,
    refetch: mutate
  };
}

// Hook for a single purchase order
export function usePurchaseOrder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<PurchaseOrder>>(
    id ? `/purchase-orders/${id}` : null,
    apiClient.fetcher
  );

  return {
    purchaseOrder: data?.data,
    isLoading,
    error,
    refetch: mutate
  };
}

// Utility hook for purchase order mutations (create, update, delete)
export function usePurchaseOrderMutations() {
  const { refetch } = usePurchaseOrders();

  const createPurchaseOrder = async (data: CreatePurchaseOrderDto) => {
    const response = await apiClient.createPurchaseOrder(data);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const updatePurchaseOrder = async (id: string, data: UpdatePurchaseOrderDto) => {
    const response = await apiClient.updatePurchaseOrder(id, data);
    if (response.data) {
      refetch();
    }
    return response;
  };

  const deletePurchaseOrder = async (id: string) => {
    const response = await apiClient.deletePurchaseOrder(id);
    refetch();
    return response;
  };

  const updatePurchaseOrderStatus = async (id: string, status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED') => {
    const response = await apiClient.updatePurchaseOrderStatus(id, status);
    if (response.data) {
      refetch();
    }
    return response;
  };

  return { createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, updatePurchaseOrderStatus };
}

// Loading states helper
export function useLoadingStates() {
  const { isLoading: loadingBranches, error: branchesError } = useBranches();
  const { isLoading: loadingOrders, error: ordersError } = useOrders();
  const { isLoading: loadingMenuItems, error: menuItemsError } = useMenuItems();
  const { isLoading: loadingDesks, error: desksError } = useDesks();
  const { isLoading: loadingStaff, error: staffError } = useStaff();
  const { isLoading: loadingIngredients, error: ingredientsError } = useIngredients();
  const { isLoading: loadingSuppliers, error: suppliersError } = useSuppliers();
  const { isLoading: loadingPurchaseOrders, error: purchaseOrdersError } = usePurchaseOrders();

  return {
    isLoading: loadingBranches || loadingOrders || loadingMenuItems || loadingDesks || loadingStaff || loadingIngredients || loadingSuppliers || loadingPurchaseOrders,
    hasError: !!branchesError || !!ordersError || !!menuItemsError || !!desksError || !!staffError || !!ingredientsError || !!suppliersError || !!purchaseOrdersError,
  };
}
