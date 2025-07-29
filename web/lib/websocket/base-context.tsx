"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../auth-context';

interface BaseWebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomType: string, roomId: string) => void;
  leaveRoom: (roomType: string, roomId: string) => void;
}

const BaseWebSocketContext = createContext<BaseWebSocketContextType | undefined>(undefined);

interface BaseWebSocketProviderProps {
  children: ReactNode;
}

export function BaseWebSocketProvider({ children }: BaseWebSocketProviderProps) {
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

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [token, user]);

  const joinRoom = (roomType: string, roomId: string) => {
    if (socket && isConnected) {
      socket.emit(`join${roomType}Room`, { [`${roomType.toLowerCase()}Id`]: roomId });
    }
  };

  const leaveRoom = (roomType: string, roomId: string) => {
    if (socket && isConnected) {
      socket.emit(`leave${roomType}Room`, { [`${roomType.toLowerCase()}Id`]: roomId });
    }
  };

  const value: BaseWebSocketContextType = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom
  };

  return (
    <BaseWebSocketContext.Provider value={value}>
      {children}
    </BaseWebSocketContext.Provider>
  );
}

export function useBaseWebSocket(): BaseWebSocketContextType {
  const context = useContext(BaseWebSocketContext);
  if (context === undefined) {
    throw new Error('useBaseWebSocket must be used within a BaseWebSocketProvider');
  }
  return context;
}
