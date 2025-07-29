"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useBaseWebSocket } from './base-context';
import { Order } from '../api/types/orders';

interface OrderWebSocketContextType {
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  joinDeskRoom: (deskId: string) => void;
  leaveDeskRoom: (deskId: string) => void;
}

interface OrderWebSocketEvents {
  onOrderCreated?: (order: Order) => void;
  onOrderStatusChanged?: (data: { orderId: string; status: string; order: Order }) => void;
  onOrderCancelled?: (data: { orderId: string; order: Order }) => void;
  onPaymentProcessed?: (data: { orderId: string; payment: any; order: Order }) => void;
  onKitchenAlert?: (data: { orderId: string; type: string; message: string; order: Order }) => void;
}

const OrderWebSocketContext = createContext<OrderWebSocketContextType | undefined>(undefined);

interface OrderWebSocketProviderProps extends OrderWebSocketEvents {
  children: ReactNode;
}

export function OrderWebSocketProvider({ 
  children,
  onOrderCreated,
  onOrderStatusChanged,
  onOrderCancelled,
  onPaymentProcessed,
  onKitchenAlert
}: OrderWebSocketProviderProps) {
  const { socket, isConnected, joinRoom, leaveRoom } = useBaseWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Order event handlers
    socket.on('orderCreated', (order: Order) => {
      console.log('Order created:', order);
      onOrderCreated?.(order);
    });

    socket.on('orderStatusChanged', (data: { orderId: string; status: string; order: Order }) => {
      console.log('Order status changed:', data);
      onOrderStatusChanged?.(data);
    });

    socket.on('orderCancelled', (data: { orderId: string; order: Order }) => {
      console.log('Order cancelled:', data);
      onOrderCancelled?.(data);
    });

    socket.on('paymentProcessed', (data: { orderId: string; payment: any; order: Order }) => {
      console.log('Payment processed:', data);
      onPaymentProcessed?.(data);
    });

    socket.on('kitchenAlert', (data: { orderId: string; type: string; message: string; order: Order }) => {
      console.log('Kitchen alert:', data);
      onKitchenAlert?.(data);
    });

    return () => {
      socket.off('orderCreated');
      socket.off('orderStatusChanged');
      socket.off('orderCancelled');
      socket.off('paymentProcessed');
      socket.off('kitchenAlert');
    };
  }, [socket, isConnected, onOrderCreated, onOrderStatusChanged, onOrderCancelled, onPaymentProcessed, onKitchenAlert]);

  const joinOrderRoom = (orderId: string) => {
    joinRoom('Order', orderId);
  };

  const leaveOrderRoom = (orderId: string) => {
    leaveRoom('Order', orderId);
  };

  const joinDeskRoom = (deskId: string) => {
    joinRoom('Desk', deskId);
  };

  const leaveDeskRoom = (deskId: string) => {
    leaveRoom('Desk', deskId);
  };

  const value: OrderWebSocketContextType = {
    joinOrderRoom,
    leaveOrderRoom,
    joinDeskRoom,
    leaveDeskRoom
  };

  return (
    <OrderWebSocketContext.Provider value={value}>
      {children}
    </OrderWebSocketContext.Provider>
  );
}

export function useOrderWebSocket(p0: { onOrderCreated: (order: any) => void; onOrderStatusChanged: (data: any) => void; onOrderCancelled: (data: any) => void; }): OrderWebSocketContextType {
  const context = useContext(OrderWebSocketContext);
  if (context === undefined) {
    throw new Error('useOrderWebSocket must be used within an OrderWebSocketProvider');
  }
  return context;
}

// Custom hook for order-specific WebSocket events
export function useOrderRoom(orderId?: string) {
  const { joinOrderRoom, leaveOrderRoom } = useOrderWebSocket();
  const { isConnected } = useBaseWebSocket();

  useEffect(() => {
    if (orderId && isConnected) {
      joinOrderRoom(orderId);
      return () => {
        leaveOrderRoom(orderId);
      };
    }
  }, [orderId, isConnected, joinOrderRoom, leaveOrderRoom]);
}

// Custom hook for desk-specific WebSocket events
export function useDeskRoom(deskId?: string) {
  const { joinDeskRoom, leaveDeskRoom } = useOrderWebSocket();
  const { isConnected } = useBaseWebSocket();

  useEffect(() => {
    if (deskId && isConnected) {
      joinDeskRoom(deskId);
      return () => {
        leaveDeskRoom(deskId);
      };
    }
  }, [deskId, isConnected, joinDeskRoom, leaveDeskRoom]);
}
