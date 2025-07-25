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
  Staff
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
export function useStaff(branchId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    branchId ? `/staff?branchId=${branchId}` : '/staff',
    async () => {
      const response = await apiClient.getStaff(branchId);
      return response.data;
    }
  );

  return {
    staff: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}

// Hook for a single staff member
export function useStaffMember(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/staff/${id}` : null,
    async () => {
      if (!id) return null;
      const response = await apiClient.getStaffMember(id);
      return response.data;
    }
  );

  return {
    staffMember: data,
    isLoading,
    error,
    refetch: mutate,
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

// Utility hook for desk mutations (create, update, delete)
export function useDeskMutations() {
  const createDesk = async (deskData: any) => {
    const response = await apiClient.createDesk(deskData);
    return response;
  };

  const updateDesk = async (id: string, deskData: any) => {
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
  const createStaff = async (staffData: any) => {
    const response = await apiClient.createStaff(staffData);
    return response;
  };

  const updateStaff = async (id: string, staffData: any) => {
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
  const createBranch = async (branchData: any) => {
    const response = await apiClient.createBranch(branchData);
    return response;
  };

  const updateBranch = async (id: string, branchData: any) => {
    const response = await apiClient.updateBranch(id, branchData);
    return response;
  };

  const deleteBranch = async (id: string) => {
    const response = await apiClient.deleteBranch(id);
    return response;
  };

  return {
    createBranch,
    updateBranch,
    deleteBranch,
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
