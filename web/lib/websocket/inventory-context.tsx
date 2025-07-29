"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useBaseWebSocket } from "./base-context";

// Using Record<never, never> instead of empty interface to satisfy linter
interface InventoryWebSocketContextType extends Record<never, never> {
  // No specific room joining methods for inventory as it's usually branch-based
}

interface InventoryWebSocketEvents {
  onInventoryAlert?: (data: {
    type: string;
    message: string;
    data: unknown;
  }) => void;
  onInventoryLevelUpdate?: (data: {
    ingredientId: string;
    quantity: number;
    status: "low" | "normal" | "high";
  }) => void;
}

const InventoryWebSocketContext = createContext<
  InventoryWebSocketContextType | undefined
>(undefined);

interface InventoryWebSocketProviderProps extends InventoryWebSocketEvents {
  children: ReactNode;
}

export function InventoryWebSocketProvider({
  children,
  onInventoryAlert,
  onInventoryLevelUpdate,
}: InventoryWebSocketProviderProps) {
  const { socket, isConnected } = useBaseWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Inventory event handlers
    socket.on(
      "inventoryAlert",
      (data: { type: string; message: string; data: unknown }) => {
        console.log("Inventory alert:", data);
        onInventoryAlert?.(data);
      }
    );

    socket.on(
      "inventoryLevelUpdate",
      (data: {
        ingredientId: string;
        quantity: number;
        status: "low" | "normal" | "high";
      }) => {
        console.log("Inventory level update:", data);
        onInventoryLevelUpdate?.(data);
      }
    );

    return () => {
      socket.off("inventoryAlert");
      socket.off("inventoryLevelUpdate");
    };
  }, [socket, isConnected, onInventoryAlert, onInventoryLevelUpdate]);

  const value: InventoryWebSocketContextType = {};

  return (
    <InventoryWebSocketContext.Provider value={value}>
      {children}
    </InventoryWebSocketContext.Provider>
  );
}

export function useInventoryWebSocket(p0: {
  onInventoryAlert: (data: any) => void;
  onInventoryLevelUpdate: (data: any) => void;
}): InventoryWebSocketContextType {
  const context = useContext(InventoryWebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useInventoryWebSocket must be used within an InventoryWebSocketProvider"
    );
  }
  return context;
}
