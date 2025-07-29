"use client";

// Export all WebSocket contexts and hooks
export * from './base-context';
export * from './order-context';
export * from './staff-context';
export * from './branch-context';
export * from './inventory-context';
export * from './dashboard-context';

// Combined WebSocket Provider
import { ReactNode } from 'react';
import { BaseWebSocketProvider } from './base-context';
import { OrderWebSocketProvider } from './order-context';
import { StaffWebSocketProvider } from './staff-context';
import { BranchWebSocketProvider } from './branch-context';
import { InventoryWebSocketProvider } from './inventory-context';
import { DashboardWebSocketProvider } from './dashboard-context';
import { Order } from '../api/types/orders';
import { Staff } from '../api/types/staff';
import { Branch } from '../api/types/branch';

interface WebSocketProviderProps {
  children: ReactNode;
  // Order events
  onOrderCreated?: (order: Order) => void;
  onOrderStatusChanged?: (data: { orderId: string; status: string; order: Order }) => void;
  onOrderCancelled?: (data: { orderId: string; order: Order }) => void;
  onPaymentProcessed?: (data: { orderId: string; payment: unknown; order: Order }) => void;
  onKitchenAlert?: (data: { orderId: string; type: string; message: string; order: Order }) => void;
  // Staff events
  onStaffCreated?: (staff: Staff) => void;
  onStaffUpdated?: (data: { staffId: string; staff: Staff }) => void;
  onStaffDeleted?: (data: { staffId: string; staff: Staff }) => void;
  onStaffStatusChanged?: (data: { staffId: string; isActive: boolean; staff: Staff }) => void;
  onStaffActivityUpdate?: (data: { staffId: string; activity: string; timestamp: string }) => void;
  // Branch events
  onBranchCreated?: (branch: Branch) => void;
  onBranchUpdated?: (data: { branchId: string; branch: Branch }) => void;
  onBranchDeleted?: (data: { branchId: string; branch: Branch }) => void;
  onBranchStatusChanged?: (data: { branchId: string; isActive: boolean; branch: Branch }) => void;
  onBranchPerformanceUpdate?: (data: { branchId: string; orders: number; revenue: number }) => void;
  // Inventory events
  onInventoryAlert?: (data: { type: string; message: string; data: unknown }) => void;
  onInventoryLevelUpdate?: (data: { ingredientId: string; quantity: number; status: 'low' | 'normal' | 'high' }) => void;
  // Dashboard events
  onDashboardMetricsUpdate?: (metrics: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingItems: Array<{ id: string; name: string; quantity: number }>;
    lowStockItems: Array<{ id: string; name: string; quantity: number; minQuantity: number }>;
    activeStaff: number;
    branchPerformance: Array<{ branchId: string; name: string; orders: number; revenue: number }>;
  }) => void;
  onRealtimeStatsUpdate?: (data: { type: string; value: number; timestamp: string }) => void;
}

export function WebSocketProvider(props: WebSocketProviderProps) {
  const { children, ...eventHandlers } = props;
  
  return (
    <BaseWebSocketProvider>
      <OrderWebSocketProvider
        onOrderCreated={eventHandlers.onOrderCreated}
        onOrderStatusChanged={eventHandlers.onOrderStatusChanged}
        onOrderCancelled={eventHandlers.onOrderCancelled}
        onPaymentProcessed={eventHandlers.onPaymentProcessed}
        onKitchenAlert={eventHandlers.onKitchenAlert}
      >
        <StaffWebSocketProvider
          onStaffCreated={eventHandlers.onStaffCreated}
          onStaffUpdated={eventHandlers.onStaffUpdated}
          onStaffDeleted={eventHandlers.onStaffDeleted}
          onStaffStatusChanged={eventHandlers.onStaffStatusChanged}
          onStaffActivityUpdate={eventHandlers.onStaffActivityUpdate}
        >
          <BranchWebSocketProvider
            onBranchCreated={eventHandlers.onBranchCreated}
            onBranchUpdated={eventHandlers.onBranchUpdated}
            onBranchDeleted={eventHandlers.onBranchDeleted}
            onBranchStatusChanged={eventHandlers.onBranchStatusChanged}
            onBranchPerformanceUpdate={eventHandlers.onBranchPerformanceUpdate}
          >
            <InventoryWebSocketProvider
              onInventoryAlert={eventHandlers.onInventoryAlert}
              onInventoryLevelUpdate={eventHandlers.onInventoryLevelUpdate}
            >
              <DashboardWebSocketProvider
                onDashboardMetricsUpdate={eventHandlers.onDashboardMetricsUpdate}
                onRealtimeStatsUpdate={eventHandlers.onRealtimeStatsUpdate}
              >
                {children}
              </DashboardWebSocketProvider>
            </InventoryWebSocketProvider>
          </BranchWebSocketProvider>
        </StaffWebSocketProvider>
      </OrderWebSocketProvider>
    </BaseWebSocketProvider>
  );
}
