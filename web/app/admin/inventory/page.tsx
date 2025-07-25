"use client"

import { InventoryManagement } from "@/components/admin/inventory/InventoryManagement"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
      </div>
      <InventoryManagement />
    </div>
  )
}
