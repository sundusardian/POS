"use client";

import { useState, useEffect } from 'react';
import {
  useBaseWebSocket,
  useOrderWebSocket,
  useStaffWebSocket,
  useBranchWebSocket,
  useInventoryWebSocket,
  useDashboardWebSocket,
  DashboardMetrics
} from './websocket';
import { Order } from './api/types/orders';
import { Staff } from './api/types/staff';
import { Branch } from './api/types/branch';

// Hook for real-time dashboard metrics
export function useDashboardMetrics() {
  const { isConnected } = useBaseWebSocket();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    lowStockItems: [],
    activeStaff: 0,
    branchPerformance: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Join dashboard metrics room
  const { joinDashboardRoom } = useDashboardWebSocket({
    onDashboardMetricsUpdate: (newMetrics) => {
      setMetrics(newMetrics);
      setIsLoading(false);
    },
    onRealtimeStatsUpdate: (data) => {
      // Update specific stats in real-time
      setMetrics(prev => {
        switch (data.type) {
          case 'totalOrders':
            return { ...prev, totalOrders: data.value };
          case 'activeOrders':
            return { ...prev, activeOrders: data.value };
          case 'completedOrders':
            return { ...prev, completedOrders: data.value };
          case 'totalRevenue':
            return { ...prev, totalRevenue: data.value };
          case 'averageOrderValue':
            return { ...prev, averageOrderValue: data.value };
          case 'activeStaff':
            return { ...prev, activeStaff: data.value };
          default:
            return prev;
        }
      });
    }
  });

  useEffect(() => {
    if (isConnected) {
      joinDashboardRoom();
    }
    
    return () => {
      // Room cleanup is handled by the context
    };
  }, [isConnected, joinDashboardRoom]);

  return {
    metrics,
    isLoading,
    isConnected
  };
}

// Hook for real-time orders
export function useRealtimeOrders(initialOrders: Order[] = []) {
  const { isConnected } = useBaseWebSocket();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Join orders room
  const { joinOrdersRoom } = useOrderWebSocket({
    onOrderCreated: (order) => {
      setOrders(prev => [order, ...prev]);
    },
    onOrderStatusChanged: (data) => {
      setOrders(prev => 
        prev.map(order => 
          order.id === data.orderId 
            ? { ...order, status: data.status }
            : order
        )
      );
    },
    onOrderCancelled: (data) => {
      setOrders(prev => 
        prev.map(order => 
          order.id === data.orderId 
            ? { ...order, status: 'CANCELLED' }
            : order
        )
      );
    }
  });

  // Update orders when initialOrders changes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    if (isConnected) {
      joinOrdersRoom();
    }
    
    return () => {
      // Room cleanup is handled by the context
    };
  }, [isConnected, joinOrdersRoom]);

  return {
    orders,
    isConnected
  };
}

// Hook for real-time inventory alerts
export function useInventoryAlerts() {
  const { isConnected } = useBaseWebSocket();
  const [alerts, setAlerts] = useState<Array<{
    type: string;
    message: string;
    timestamp: string;
    data: unknown;
  }>>([]);
  
  const [lowStockItems, setLowStockItems] = useState<Array<{
    ingredientId: string;
    quantity: number;
    status: 'low' | 'normal' | 'high';
    name?: string;
  }>>([]);

  // Join inventory room
  const { joinInventoryRoom } = useInventoryWebSocket({
    onInventoryAlert: (data) => {
      setAlerts(prev => [{
        ...data,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 19)]); // Keep last 20 alerts
    },
    onInventoryLevelUpdate: (data) => {
      if (data.status === 'low') {
        // Add or update low stock item
        setLowStockItems(prev => {
          const exists = prev.some(item => item.ingredientId === data.ingredientId);
          if (exists) {
            return prev.map(item => 
              item.ingredientId === data.ingredientId 
                ? { ...item, quantity: data.quantity, status: data.status }
                : item
            );
          } else {
            return [...prev, data];
          }
        });
      } else {
        // Remove from low stock if status changed
        setLowStockItems(prev => 
          prev.filter(item => item.ingredientId !== data.ingredientId)
        );
      }
    }
  });

  useEffect(() => {
    if (isConnected) {
      joinInventoryRoom();
    }
    
    return () => {
      // Room cleanup is handled by the context
    };
  }, [isConnected, joinInventoryRoom]);

  return {
    alerts,
    lowStockItems,
    isConnected
  };
}

// Hook for real-time staff activity
export function useStaffActivity(initialStaff: Staff[] = []) {
  const { isConnected } = useBaseWebSocket();
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [activities, setActivities] = useState<Array<{
    staffId: string;
    activity: string;
    timestamp: string;
    staffName?: string;
  }>>([]);
  
  // Join staff room
  const { joinStaffRoom } = useStaffWebSocket({
    onStaffCreated: (newStaff) => {
      setStaff(prev => [...prev, newStaff]);
    },
    onStaffUpdated: (data) => {
      setStaff(prev => 
        prev.map(staffMember => 
          staffMember.id === data.staffId 
            ? data.staff
            : staffMember
        )
      );
    },
    onStaffDeleted: (data) => {
      setStaff(prev => 
        prev.filter(staffMember => staffMember.id !== data.staffId)
      );
    },
    onStaffStatusChanged: (data) => {
      setStaff(prev => 
        prev.map(staffMember => 
          staffMember.id === data.staffId 
            ? { ...staffMember, isActive: data.isActive }
            : staffMember
        )
      );
    },
    onStaffActivityUpdate: (data) => {
      // Add staff name if available
      const staffMember = staff.find(s => s.id === data.staffId);
      setActivities(prev => [{
        ...data,
        staffName: staffMember?.name
      }, ...prev.slice(0, 19)]); // Keep last 20 activities
    }
  });

  // Update staff when initialStaff changes
  useEffect(() => {
    setStaff(initialStaff);
  }, [initialStaff]);

  useEffect(() => {
    if (isConnected) {
      joinStaffRoom();
    }
    
    return () => {
      // Room cleanup is handled by the context
    };
  }, [isConnected, joinStaffRoom]);

  return {
    staff,
    activities,
    isConnected
  };
}

// Hook for real-time branch performance
export function useBranchPerformance(initialBranches: Branch[] = []) {
  const { isConnected } = useBaseWebSocket();
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [performance, setPerformance] = useState<Array<{
    branchId: string;
    orders: number;
    revenue: number;
    name?: string;
  }>>([]);
  
  // Join branch room
  const { joinBranchRoom } = useBranchWebSocket({
    onBranchCreated: (branch) => {
      setBranches(prev => [...prev, branch]);
    },
    onBranchUpdated: (data) => {
      setBranches(prev => 
        prev.map(branch => 
          branch.id === data.branchId 
            ? data.branch
            : branch
        )
      );
    },
    onBranchDeleted: (data) => {
      setBranches(prev => 
        prev.filter(branch => branch.id !== data.branchId)
      );
    },
    onBranchPerformanceUpdate: (data) => {
      // Add branch name if available
      const branch = branches.find(b => b.id === data.branchId);
      setPerformance(prev => {
        const exists = prev.some(item => item.branchId === data.branchId);
        if (exists) {
          return prev.map(item => 
            item.branchId === data.branchId 
              ? { ...data, name: branch?.name }
              : item
          );
        } else {
          return [...prev, { ...data, name: branch?.name }];
        }
      });
    }
  });

  // Update branches when initialBranches changes
  useEffect(() => {
    setBranches(initialBranches);
  }, [initialBranches]);

  useEffect(() => {
    if (isConnected) {
      joinBranchRoom();
    }
    
    return () => {
      // Room cleanup is handled by the context
    };
  }, [isConnected, joinBranchRoom]);

  return {
    branches,
    performance,
    isConnected
  };
}
