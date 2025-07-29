"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useBaseWebSocket } from "./base-context";

interface DashboardMetrics {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{ id: string; name: string; quantity: number }>;
  lowStockItems: Array<{
    id: string;
    name: string;
    quantity: number;
    minQuantity: number;
  }>;
  activeStaff: number;
  branchPerformance: Array<{
    branchId: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
}

// Using Record<never, never> instead of empty interface to satisfy linter
interface DashboardWebSocketContextType extends Record<never, never> {
  // No specific room joining methods for dashboard as it's usually branch-based
}

interface DashboardWebSocketEvents {
  onDashboardMetricsUpdate?: (metrics: DashboardMetrics) => void;
  onRealtimeStatsUpdate?: (data: {
    type: string;
    value: number;
    timestamp: string;
  }) => void;
}

const DashboardWebSocketContext = createContext<
  DashboardWebSocketContextType | undefined
>(undefined);

interface DashboardWebSocketProviderProps extends DashboardWebSocketEvents {
  children: ReactNode;
}

export function DashboardWebSocketProvider({
  children,
  onDashboardMetricsUpdate,
  onRealtimeStatsUpdate,
}: DashboardWebSocketProviderProps) {
  const { socket, isConnected } = useBaseWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Dashboard event handlers
    socket.on("dashboardMetricsUpdate", (metrics: DashboardMetrics) => {
      console.log("Dashboard metrics update:", metrics);
      onDashboardMetricsUpdate?.(metrics);
    });

    socket.on(
      "realtimeStatsUpdate",
      (data: { type: string; value: number; timestamp: string }) => {
        console.log("Realtime stats update:", data);
        onRealtimeStatsUpdate?.(data);
      }
    );

    return () => {
      socket.off("dashboardMetricsUpdate");
      socket.off("realtimeStatsUpdate");
    };
  }, [socket, isConnected, onDashboardMetricsUpdate, onRealtimeStatsUpdate]);

  const value: DashboardWebSocketContextType = {};

  return (
    <DashboardWebSocketContext.Provider value={value}>
      {children}
    </DashboardWebSocketContext.Provider>
  );
}

export function useDashboardWebSocket(p0: {
  onDashboardMetricsUpdate: (newMetrics: any) => void;
  onRealtimeStatsUpdate: (data: any) => void;
}): DashboardWebSocketContextType {
  const context = useContext(DashboardWebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardWebSocket must be used within a DashboardWebSocketProvider"
    );
  }
  return context;
}

// Custom hooks for specific dashboard metrics
export function useDashboardMetrics() {
  const { socket, isConnected } = useBaseWebSocket();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMetricsUpdate = (data: DashboardMetrics) => {
      setMetrics(data);
    };

    socket.on("dashboardMetricsUpdate", handleMetricsUpdate);

    // Request initial metrics
    socket.emit("requestDashboardMetrics");

    return () => {
      socket.off("dashboardMetricsUpdate", handleMetricsUpdate);
    };
  }, [socket, isConnected]);

  return metrics;
}

// Hook for real-time stats by type
export function useRealtimeStats(statType: string) {
  const { socket, isConnected } = useBaseWebSocket();
  const [statValue, setStatValue] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleStatsUpdate = (data: {
      type: string;
      value: number;
      timestamp: string;
    }) => {
      if (data.type === statType) {
        setStatValue(data.value);
        setTimestamp(data.timestamp);
      }
    };

    socket.on("realtimeStatsUpdate", handleStatsUpdate);

    // Request initial stats
    socket.emit("requestRealtimeStats", { type: statType });

    return () => {
      socket.off("realtimeStatsUpdate", handleStatsUpdate);
    };
  }, [socket, isConnected, statType]);

  return { value: statValue, timestamp };
}
