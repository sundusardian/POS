"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { SupplierIngredient } from "@/lib/api-client"

interface DeleteSupplierIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierIngredient: SupplierIngredient | null
  onDeleteSupplierIngredient: (id: string) => Promise<void>
}

export function DeleteSupplierIngredientDialog({
  open,
  onOpenChange,
  supplierIngredient,
  onDeleteSupplierIngredient,
}: DeleteSupplierIngredientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!supplierIngredient?.id) return

    try {
      setIsDeleting(true)
      await onDeleteSupplierIngredient(supplierIngredient.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting supplier ingredient:", error)
      toast.error("Failed to delete supplier ingredient")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the supplier ingredient{" "}
            <strong>{supplierIngredient?.ingredient?.name}</strong> from supplier{" "}
            <strong>{supplierIngredient?.supplier?.name}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
