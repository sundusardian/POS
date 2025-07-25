"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { 
  Supplier, 
  useSuppliers, 
  useSupplierMutations 
} from "@/lib/hooks"
import { AddSupplierDialog } from "./AddSupplierDialog"
import { EditSupplierDialog } from "./EditSupplierDialog"
import { DeleteSupplierDialog } from "./DeleteSupplierDialog"
import { SuppliersTable } from "./SuppliersTable"
import { SupplierIngredientsDialog } from "./SupplierIngredientsDialog"

export function SuppliersTab() {
  // State for search
  const [supplierSearch, setSupplierSearch] = useState("")
  
  // State for dialogs
  const [addSupplierOpen, setAddSupplierOpen] = useState(false)
  const [editSupplierOpen, setEditSupplierOpen] = useState(false)
  const [deleteSupplierOpen, setDeleteSupplierOpen] = useState(false)
  const [supplierIngredientsOpen, setSupplierIngredientsOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)

  // Fetch suppliers data
  const { data: suppliers, isLoading, error, mutate: refetchSuppliers } = useSuppliers()
  
  // Supplier mutations
  const { createSupplier, updateSupplier, deleteSupplier } = useSupplierMutations()

  // Handle add supplier
  const handleAddSupplier = async (supplierData: {
    name: string
    contactPerson: string
    email: string
    phone: string
    address: string
  }) => {
    try {
      await createSupplier(supplierData)
      toast.success("Supplier added successfully")
      refetchSuppliers()
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding supplier:", error)
      toast.error("Failed to add supplier")
      return Promise.reject(error)
    }
  }

  // Handle edit supplier
  const handleEditSupplier = async (id: string, supplierData: {
    name: string
    contactPerson: string
    email: string
    phone: string
    address: string
  }) => {
    try {
      await updateSupplier(id, supplierData)
      toast.success("Supplier updated successfully")
      refetchSuppliers()
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating supplier:", error)
      toast.error("Failed to update supplier")
      return Promise.reject(error)
    }
  }

  // Handle delete supplier
  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteSupplier(id)
      toast.success("Supplier deleted successfully")
      refetchSuppliers()
      return Promise.resolve()
    } catch (error) {
      console.error("Error deleting supplier:", error)
      toast.error("Failed to delete supplier")
      return Promise.reject(error)
    }
  }

  // Open edit dialog
  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setEditSupplierOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setDeleteSupplierOpen(true)
  }

  // Open supplier ingredients dialog
  const openSupplierIngredientsDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setSupplierIngredientsOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search suppliers..."
          value={supplierSearch}
          onChange={(e) => setSupplierSearch(e.target.value)}
          className="w-[250px]"
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchSuppliers()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={() => setAddSupplierOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex justify-center p-4 text-destructive">
          Error loading suppliers. Please try again.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <SuppliersTable
          suppliers={suppliers || []}
          supplierSearch={supplierSearch}
          onEditSupplier={openEditDialog}
          onDeleteSupplier={openDeleteDialog}
          onViewSupplierIngredients={openSupplierIngredientsDialog}
        />
      )}

      {/* Dialogs */}
      <AddSupplierDialog
        open={addSupplierOpen}
        onOpenChange={setAddSupplierOpen}
        onAddSupplier={handleAddSupplier}
      />
      
      <EditSupplierDialog
        open={editSupplierOpen}
        onOpenChange={setEditSupplierOpen}
        supplier={currentSupplier}
        onEditSupplier={handleEditSupplier}
      />
      
      <DeleteSupplierDialog
        open={deleteSupplierOpen}
        onOpenChange={setDeleteSupplierOpen}
        supplier={currentSupplier}
        onDeleteSupplier={handleDeleteSupplier}
      />
      
      <SupplierIngredientsDialog
        open={supplierIngredientsOpen}
        onOpenChange={setSupplierIngredientsOpen}
        supplier={currentSupplier}
      />
    </div>
  )
}
