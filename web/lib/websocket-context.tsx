"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { Order, Staff, Branch } from './api-client';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  joinDeskRoom: (deskId: string) => void;
  leaveDeskRoom: (deskId: string) => void;
  joinBranchRoom: (branchId: string) => void;
  leaveBranchRoom: (branchId: string) => void;
  joinStaffRoom: (staffId: string) => void;
  leaveStaffRoom: (staffId: string) => void;
}

interface WebSocketEvents {
  orderCreated: (order: Order) => void;
  orderStatusChanged: (data: { orderId: string; status: string; order: Order }) => void;
  orderCancelled: (data: { orderId: string; order: Order }) => void;
  paymentProcessed: (data: { orderId: string; payment: any; order: Order }) => void;
  kitchenAlert: (data: { orderId: string; type: string; message: string; order: Order }) => void;
  inventoryAlert: (data: { type: string; message: string; data: any }) => void;
  staffCreated: (staff: Staff) => void;
  staffUpdated: (data: { staffId: string; staff: Staff }) => void;
  staffDeleted: (data: { staffId: string; staff: Staff }) => void;
  staffStatusChanged: (data: { staffId: string; isActive: boolean; staff: Staff }) => void;
  branchCreated: (branch: Branch) => void;
  branchUpdated: (data: { branchId: string; branch: Branch }) => void;
  branchDeleted: (data: { branchId: string; branch: Branch }) => void;
  branchStatusChanged: (data: { branchId: string; isActive: boolean; branch: Branch }) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  onOrderCreated?: (order: Order) => void;
  onOrderStatusChanged?: (data: { orderId: string; status: string; order: Order }) => void;
  onOrderCancelled?: (data: { orderId: string; order: Order }) => void;
  onPaymentProcessed?: (data: { orderId: string; payment: any; order: Order }) => void;
  onKitchenAlert?: (data: { orderId: string; type: string; message: string; order: Order }) => void;
  onInventoryAlert?: (data: { type: string; message: string; data: any }) => void;
  onStaffCreated?: (staff: Staff) => void;
  onStaffUpdated?: (data: { staffId: string; staff: Staff }) => void;
  onStaffDeleted?: (data: { staffId: string; staff: Staff }) => void;
  onStaffStatusChanged?: (data: { staffId: string; isActive: boolean; staff: Staff }) => void;
  onBranchCreated?: (branch: Branch) => void;
  onBranchUpdated?: (data: { branchId: string; branch: Branch }) => void;
  onBranchDeleted?: (data: { branchId: string; branch: Branch }) => void;
  onBranchStatusChanged?: (data: { branchId: string; isActive: boolean; branch: Branch }) => void;
}

export function WebSocketProvider({ 
  children, 
  onOrderCreated,
  onOrderStatusChanged,
  onOrderCancelled,
  onPaymentProcessed,
  onKitchenAlert,
  onInventoryAlert,
  onStaffCreated,
  onStaffUpdated,
  onStaffDeleted,
  onStaffStatusChanged
}: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      // Disconnect if no token or user
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Auto-join user's branch rooms
      if (user.primaryBranchId) {
        newSocket.emit('joinBranchRoom', { branchId: user.primaryBranchId });
      }
      
      if (user.branches) {
        user.branches.forEach(branchId => {
          newSocket.emit('joinBranchRoom', { branchId });
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Business event handlers
    newSocket.on('orderCreated', (order: Order) => {
      console.log('Order created:', order);
      onOrderCreated?.(order);
    });

    newSocket.on('orderStatusChanged', (data: { orderId: string; status: string; order: Order }) => {
      console.log('Order status changed:', data);
      onOrderStatusChanged?.(data);
    });

    newSocket.on('orderCancelled', (data: { orderId: string; order: Order }) => {
      console.log('Order cancelled:', data);
      onOrderCancelled?.(data);
    });

    newSocket.on('paymentProcessed', (data: { orderId: string; payment: any; order: Order }) => {
      console.log('Payment processed:', data);
      onPaymentProcessed?.(data);
    });

    newSocket.on('kitchenAlert', (data: { orderId: string; type: string; message: string; order: Order }) => {
      console.log('Kitchen alert:', data);
      onKitchenAlert?.(data);
    });

    newSocket.on('inventoryAlert', (data: { type: string; message: string; data: any }) => {
      console.log('Inventory alert:', data);
      onInventoryAlert?.(data);
    });

    // Staff event handlers
    newSocket.on('staffCreated', (staff: Staff) => {
      console.log('Staff created:', staff);
      onStaffCreated?.(staff);
    });

    newSocket.on('staffUpdated', (data: { staffId: string; staff: Staff }) => {
      console.log('Staff updated:', data);
      onStaffUpdated?.(data);
    });

    newSocket.on('staffDeleted', (data: { staffId: string; staff: Staff }) => {
      console.log('Staff deleted:', data);
      onStaffDeleted?.(data);
    });

    newSocket.on('staffStatusChanged', (data: { staffId: string; isActive: boolean; staff: Staff }) => {
      console.log('Staff status changed:', data);
      onStaffStatusChanged?.(data);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [token, user]);

  const joinOrderRoom = (orderId: string) => {
    if (socket && isConnected) {
      socket.emit('joinOrderRoom', { orderId });
    }
  };

  const leaveOrderRoom = (orderId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveOrderRoom', { orderId });
    }
  };

  const joinDeskRoom = (deskId: string) => {
    if (socket && isConnected) {
      socket.emit('joinDeskRoom', { deskId });
    }
  };

  const leaveDeskRoom = (deskId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveDeskRoom', { deskId });
    }
  };

  const joinBranchRoom = (branchId: string) => {
    if (socket && isConnected) {
      socket.emit('joinBranchRoom', { branchId });
    }
  };

  const leaveBranchRoom = (branchId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveBranchRoom', { branchId });
    }
  };

  const joinStaffRoom = (staffId: string) => {
    if (socket && isConnected) {
      socket.emit('joinStaffRoom', { staffId });
    }
  };

  const leaveStaffRoom = (staffId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveStaffRoom', { staffId });
    }
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    joinOrderRoom,
    leaveOrderRoom,
    joinDeskRoom,
    leaveDeskRoom,
    joinBranchRoom,
    leaveBranchRoom,
    joinStaffRoom,
    leaveStaffRoom,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

// Custom hook for order-specific WebSocket events
export function useOrderWebSocket(orderId?: string) {
  const { socket, isConnected, joinOrderRoom, leaveOrderRoom } = useWebSocket();

  useEffect(() => {
    if (orderId && isConnected) {
      joinOrderRoom(orderId);
      return () => {
        leaveOrderRoom(orderId);
      };
    }
  }, [orderId, isConnected, joinOrderRoom, leaveOrderRoom]);

  return { socket, isConnected };
}

// Custom hook for desk-specific WebSocket events
export function useDeskWebSocket(deskId?: string) {
  const { socket, isConnected, joinDeskRoom, leaveDeskRoom } = useWebSocket();

  useEffect(() => {
    if (deskId && isConnected) {
      joinDeskRoom(deskId);
      return () => {
        leaveDeskRoom(deskId);
      };
    }
  }, [deskId, isConnected, joinDeskRoom, leaveDeskRoom]);

  return { socket, isConnected };
}

// Custom hook for staff-specific WebSocket events
export function useStaffWebSocket(staffId?: string) {
  const { socket, isConnected, joinStaffRoom, leaveStaffRoom } = useWebSocket();

  useEffect(() => {
    if (staffId && isConnected) {
      joinStaffRoom(staffId);
      return () => {
        leaveStaffRoom(staffId);
      };
    }
  }, [staffId, isConnected, joinStaffRoom, leaveStaffRoom]);

  return { socket, isConnected };
}
