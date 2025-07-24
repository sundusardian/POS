// Custom hooks for data fetching using SWR
import useSWR from 'swr';
import apiClient, { 
  ApiResponse, 
  Branch, 
  Category,
  MenuItem, 
  Desk, 
  Order,
  User
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
    () => id ? apiClient.getCategory(id) : null,
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
    () => id ? apiClient.getBranch(id) : null,
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
    () => id ? apiClient.getMenuItem(id) : null,
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
    () => id ? apiClient.getDesk(id) : null,
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
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<Order>>(
    id ? `/orders/${id}` : null,
    id ? () => apiClient.getOrder(id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    order: data?.data || null,
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

// Utility hook for mutations (create, update, delete)
export function useOrderMutations() {
  const createOrder = async (orderData: any) => {
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

// Loading states helper
export function useLoadingStates() {
  const branches = useBranches();
  const menuItems = useMenuItems();
  
  return {
    isInitialLoading: branches.isLoading || menuItems.isLoading,
    hasErrors: !!branches.error || !!menuItems.error,
    errors: [branches.error, menuItems.error].filter(Boolean),
  };
}
