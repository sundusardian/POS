"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { SupplierIngredient } from "@/lib/api-client"

interface EditSupplierIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierIngredient: SupplierIngredient | null
  onEditSupplierIngredient: (id: string, supplierIngredient: {
    price: number
    leadTime: number
    minOrderQuantity: number
    notes: string
  }) => Promise<void>
}

export function EditSupplierIngredientDialog({
  open,
  onOpenChange,
  supplierIngredient,
  onEditSupplierIngredient,
}: EditSupplierIngredientDialogProps) {
  const [supplierIngredientForm, setSupplierIngredientForm] = useState({
    price: 0,
    leadTime: 1,
    minOrderQuantity: 1,
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when supplier ingredient changes
  useEffect(() => {
    if (supplierIngredient) {
      setSupplierIngredientForm({
        price: supplierIngredient.price,
        leadTime: supplierIngredient.leadTime || 1,
        minOrderQuantity: supplierIngredient.minOrderQuantity || 1,
        notes: supplierIngredient.notes || "",
      })
    }
  }, [supplierIngredient])

  const handleSubmit = async () => {
    if (!supplierIngredient?.id) {
      toast.error("Supplier ingredient ID is required")
      return
    }

    if (supplierIngredientForm.price <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    try {
      setIsSubmitting(true)
      await onEditSupplierIngredient(supplierIngredient.id, supplierIngredientForm)
      onOpenChange(false)
    } catch (error) {
      console.error("Error editing supplier ingredient:", error)
      toast.error("Failed to edit supplier ingredient")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Supplier Ingredient</DialogTitle>
          <DialogDescription>
            Update supplier ingredient information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ingredient</Label>
            <div className="col-span-3 text-sm">
              {supplierIngredient?.ingredient?.name || "Unknown"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-ingredient-price" className="text-right">
              Price
            </Label>
            <Input
              id="edit-supplier-ingredient-price"
              type="number"
              value={supplierIngredientForm.price}
              onChange={(e) =>
                setSupplierIngredientForm({
                  ...supplierIngredientForm,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-ingredient-lead-time" className="text-right">
              Lead Time (days)
            </Label>
            <Input
              id="edit-supplier-ingredient-lead-time"
              type="number"
              value={supplierIngredientForm.leadTime}
              onChange={(e) =>
                setSupplierIngredientForm({
                  ...supplierIngredientForm,
                  leadTime: parseInt(e.target.value) || 1,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-ingredient-min-order" className="text-right">
              Min Order Qty
            </Label>
            <Input
              id="edit-supplier-ingredient-min-order"
              type="number"
              value={supplierIngredientForm.minOrderQuantity}
              onChange={(e) =>
                setSupplierIngredientForm({
                  ...supplierIngredientForm,
                  minOrderQuantity: parseInt(e.target.value) || 1,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-ingredient-notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="edit-supplier-ingredient-notes"
              value={supplierIngredientForm.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSupplierIngredientForm({
                  ...supplierIngredientForm,
                  notes: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
