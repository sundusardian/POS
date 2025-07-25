"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { 
  Supplier, 
  Ingredient, 
  SupplierIngredient, 
  useSupplierIngredients, 
  useIngredients,
  useSupplierIngredientMutations
} from "@/lib/hooks"
import { AddSupplierIngredientDialog } from "./AddSupplierIngredientDialog"
import { EditSupplierIngredientDialog } from "./EditSupplierIngredientDialog"
import { DeleteSupplierIngredientDialog } from "./DeleteSupplierIngredientDialog"
import { SupplierIngredientsTable } from "./SupplierIngredientsTable"

interface SupplierIngredientsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
}

export function SupplierIngredientsDialog({
  open,
  onOpenChange,
  supplier,
}: SupplierIngredientsDialogProps) {
  // State for search
  const [supplierIngredientSearch, setSupplierIngredientSearch] = useState("")
  
  // State for dialogs
  const [addSupplierIngredientOpen, setAddSupplierIngredientOpen] = useState(false)
  const [editSupplierIngredientOpen, setEditSupplierIngredientOpen] = useState(false)
  const [deleteSupplierIngredientOpen, setDeleteSupplierIngredientOpen] = useState(false)
  const [currentSupplierIngredient, setCurrentSupplierIngredient] = useState<SupplierIngredient | null>(null)

  // Fetch data
  const { data: supplierIngredients, isLoading, error, mutate: refetchSupplierIngredients } = 
    useSupplierIngredients(supplier?.id)
  const { data: ingredients } = useIngredients()
  
  // Supplier ingredient mutations
  const { 
    createSupplierIngredient, 
    updateSupplierIngredient, 
    deleteSupplierIngredient 
  } = useSupplierIngredientMutations()

  // Handle add supplier ingredient
  const handleAddSupplierIngredient = async (supplierIngredientData: {
    supplierId: string
    ingredientId: string
    price: number
    leadTime: number
    minOrderQuantity: number
    notes: string
  }) => {
    try {
      await createSupplierIngredient(supplierIngredientData)
      toast.success("Supplier ingredient added successfully")
      refetchSupplierIngredients()
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding supplier ingredient:", error)
      toast.error("Failed to add supplier ingredient")
      return Promise.reject(error)
    }
  }

  // Handle edit supplier ingredient
  const handleEditSupplierIngredient = async (id: string, supplierIngredientData: {
    price: number
    leadTime: number
    minOrderQuantity: number
    notes: string
  }) => {
    try {
      await updateSupplierIngredient(id, supplierIngredientData)
      toast.success("Supplier ingredient updated successfully")
      refetchSupplierIngredients()
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating supplier ingredient:", error)
      toast.error("Failed to update supplier ingredient")
      return Promise.reject(error)
    }
  }

  // Handle delete supplier ingredient
  const handleDeleteSupplierIngredient = async (id: string) => {
    try {
      await deleteSupplierIngredient(id)
      toast.success("Supplier ingredient deleted successfully")
      refetchSupplierIngredients()
      return Promise.resolve()
    } catch (error) {
      console.error("Error deleting supplier ingredient:", error)
      toast.error("Failed to delete supplier ingredient")
      return Promise.reject(error)
    }
  }

  // Open edit dialog
  const openEditDialog = (supplierIngredient: SupplierIngredient) => {
    setCurrentSupplierIngredient(supplierIngredient)
    setEditSupplierIngredientOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (supplierIngredient: SupplierIngredient) => {
    setCurrentSupplierIngredient(supplierIngredient)
    setDeleteSupplierIngredientOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Supplier Ingredients - {supplier?.name}</DialogTitle>
          <DialogDescription>
            Manage ingredients supplied by {supplier?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search ingredients..."
              value={supplierIngredientSearch}
              onChange={(e) => setSupplierIngredientSearch(e.target.value)}
              className="w-[250px]"
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetchSupplierIngredients()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={() => setAddSupplierIngredientOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Ingredient
              </Button>
            </div>
          </div>

          {error ? (
            <div className="flex justify-center p-4 text-destructive">
              Error loading supplier ingredients. Please try again.
            </div>
          ) : isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <SupplierIngredientsTable
              supplierIngredients={supplierIngredients || []}
              supplierIngredientSearch={supplierIngredientSearch}
              onEditSupplierIngredient={openEditDialog}
              onDeleteSupplierIngredient={openDeleteDialog}
            />
          )}
        </div>

        {/* Dialogs */}
        <AddSupplierIngredientDialog
          open={addSupplierIngredientOpen}
          onOpenChange={setAddSupplierIngredientOpen}
          supplier={supplier}
          ingredients={ingredients || []}
          onAddSupplierIngredient={handleAddSupplierIngredient}
        />
        
        <EditSupplierIngredientDialog
          open={editSupplierIngredientOpen}
          onOpenChange={setEditSupplierIngredientOpen}
          supplierIngredient={currentSupplierIngredient}
          onEditSupplierIngredient={handleEditSupplierIngredient}
        />
        
        <DeleteSupplierIngredientDialog
          open={deleteSupplierIngredientOpen}
          onOpenChange={setDeleteSupplierIngredientOpen}
          supplierIngredient={currentSupplierIngredient}
          onDeleteSupplierIngredient={handleDeleteSupplierIngredient}
        />
      </DialogContent>
    </Dialog>
  )
}
