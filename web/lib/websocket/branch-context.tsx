"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useBaseWebSocket } from './base-context';
import { Branch } from '../api/types/branch';

interface BranchWebSocketContextType {
  joinBranchRoom: (branchId: string) => void;
  leaveBranchRoom: (branchId: string) => void;
}

interface BranchWebSocketEvents {
  onBranchCreated?: (branch: Branch) => void;
  onBranchUpdated?: (data: { branchId: string; branch: Branch }) => void;
  onBranchDeleted?: (data: { branchId: string; branch: Branch }) => void;
  onBranchStatusChanged?: (data: { branchId: string; isActive: boolean; branch: Branch }) => void;
  onBranchPerformanceUpdate?: (data: { branchId: string; orders: number; revenue: number }) => void;
}

const BranchWebSocketContext = createContext<BranchWebSocketContextType | undefined>(undefined);

interface BranchWebSocketProviderProps extends BranchWebSocketEvents {
  children: ReactNode;
}

export function BranchWebSocketProvider({ 
  children,
  onBranchCreated,
  onBranchUpdated,
  onBranchDeleted,
  onBranchStatusChanged,
  onBranchPerformanceUpdate
}: BranchWebSocketProviderProps) {
  const { socket, isConnected, joinRoom, leaveRoom } = useBaseWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Branch event handlers
    socket.on('branchCreated', (branch: Branch) => {
      console.log('Branch created:', branch);
      onBranchCreated?.(branch);
    });

    socket.on('branchUpdated', (data: { branchId: string; branch: Branch }) => {
      console.log('Branch updated:', data);
      onBranchUpdated?.(data);
    });

    socket.on('branchDeleted', (data: { branchId: string; branch: Branch }) => {
      console.log('Branch deleted:', data);
      onBranchDeleted?.(data);
    });

    socket.on('branchStatusChanged', (data: { branchId: string; isActive: boolean; branch: Branch }) => {
      console.log('Branch status changed:', data);
      onBranchStatusChanged?.(data);
    });
    
    socket.on('branchPerformanceUpdate', (data: { branchId: string; orders: number; revenue: number }) => {
      console.log('Branch performance update:', data);
      onBranchPerformanceUpdate?.(data);
    });

    return () => {
      socket.off('branchCreated');
      socket.off('branchUpdated');
      socket.off('branchDeleted');
      socket.off('branchStatusChanged');
      socket.off('branchPerformanceUpdate');
    };
  }, [socket, isConnected, onBranchCreated, onBranchUpdated, onBranchDeleted, onBranchStatusChanged, onBranchPerformanceUpdate]);

  const joinBranchRoom = (branchId: string) => {
    joinRoom('Branch', branchId);
  };

  const leaveBranchRoom = (branchId: string) => {
    leaveRoom('Branch', branchId);
  };

  const value: BranchWebSocketContextType = {
    joinBranchRoom,
    leaveBranchRoom
  };

  return (
    <BranchWebSocketContext.Provider value={value}>
      {children}
    </BranchWebSocketContext.Provider>
  );
}

export function useBranchWebSocket(p0: { onBranchCreated: (branch: any) => void; onBranchUpdated: (data: any) => void; onBranchDeleted: (data: any) => void; onBranchPerformanceUpdate: (data: any) => void; }): BranchWebSocketContextType {
  const context = useContext(BranchWebSocketContext);
  if (context === undefined) {
    throw new Error('useBranchWebSocket must be used within a BranchWebSocketProvider');
  }
  return context;
}

// Custom hook for branch-specific WebSocket events
export function useBranchRoom(branchId?: string) {
  const { joinBranchRoom, leaveBranchRoom } = useBranchWebSocket();
  const { isConnected } = useBaseWebSocket();

  useEffect(() => {
    if (branchId && isConnected) {
      joinBranchRoom(branchId);
      return () => {
        leaveBranchRoom(branchId);
      };
    }
  }, [branchId, isConnected, joinBranchRoom, leaveBranchRoom]);
}
