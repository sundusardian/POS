"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useBaseWebSocket } from './base-context';
import { Staff } from '../api/types/staff';

interface StaffWebSocketContextType {
  joinStaffRoom: (staffId: string) => void;
  leaveStaffRoom: (staffId: string) => void;
}

interface StaffWebSocketEvents {
  onStaffCreated?: (staff: Staff) => void;
  onStaffUpdated?: (data: { staffId: string; staff: Staff }) => void;
  onStaffDeleted?: (data: { staffId: string; staff: Staff }) => void;
  onStaffStatusChanged?: (data: { staffId: string; isActive: boolean; staff: Staff }) => void;
  onStaffActivityUpdate?: (data: { staffId: string; activity: string; timestamp: string }) => void;
}

const StaffWebSocketContext = createContext<StaffWebSocketContextType | undefined>(undefined);

interface StaffWebSocketProviderProps extends StaffWebSocketEvents {
  children: ReactNode;
}

export function StaffWebSocketProvider({ 
  children,
  onStaffCreated,
  onStaffUpdated,
  onStaffDeleted,
  onStaffStatusChanged,
  onStaffActivityUpdate
}: StaffWebSocketProviderProps) {
  const { socket, isConnected, joinRoom, leaveRoom } = useBaseWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Staff event handlers
    socket.on('staffCreated', (staff: Staff) => {
      console.log('Staff created:', staff);
      onStaffCreated?.(staff);
    });

    socket.on('staffUpdated', (data: { staffId: string; staff: Staff }) => {
      console.log('Staff updated:', data);
      onStaffUpdated?.(data);
    });

    socket.on('staffDeleted', (data: { staffId: string; staff: Staff }) => {
      console.log('Staff deleted:', data);
      onStaffDeleted?.(data);
    });

    socket.on('staffStatusChanged', (data: { staffId: string; isActive: boolean; staff: Staff }) => {
      console.log('Staff status changed:', data);
      onStaffStatusChanged?.(data);
    });
    
    socket.on('staffActivityUpdate', (data: { staffId: string; activity: string; timestamp: string }) => {
      console.log('Staff activity update:', data);
      onStaffActivityUpdate?.(data);
    });

    return () => {
      socket.off('staffCreated');
      socket.off('staffUpdated');
      socket.off('staffDeleted');
      socket.off('staffStatusChanged');
      socket.off('staffActivityUpdate');
    };
  }, [socket, isConnected, onStaffCreated, onStaffUpdated, onStaffDeleted, onStaffStatusChanged, onStaffActivityUpdate]);

  const joinStaffRoom = (staffId: string) => {
    joinRoom('Staff', staffId);
  };

  const leaveStaffRoom = (staffId: string) => {
    leaveRoom('Staff', staffId);
  };

  const value: StaffWebSocketContextType = {
    joinStaffRoom,
    leaveStaffRoom
  };

  return (
    <StaffWebSocketContext.Provider value={value}>
      {children}
    </StaffWebSocketContext.Provider>
  );
}

export function useStaffWebSocket(p0: { onStaffCreated: (newStaff: any) => void; onStaffUpdated: (data: any) => void; onStaffDeleted: (data: any) => void; onStaffStatusChanged: (data: any) => void; onStaffActivityUpdate: (data: any) => void; }): StaffWebSocketContextType {
  const context = useContext(StaffWebSocketContext);
  if (context === undefined) {
    throw new Error('useStaffWebSocket must be used within a StaffWebSocketProvider');
  }
  return context;
}

// Custom hook for staff-specific WebSocket events
export function useStaffRoom(staffId?: string) {
  const { joinStaffRoom, leaveStaffRoom } = useStaffWebSocket();
  const { isConnected } = useBaseWebSocket();

  useEffect(() => {
    if (staffId && isConnected) {
      joinStaffRoom(staffId);
      return () => {
        leaveStaffRoom(staffId);
      };
    }
  }, [staffId, isConnected, joinStaffRoom, leaveStaffRoom]);
}
