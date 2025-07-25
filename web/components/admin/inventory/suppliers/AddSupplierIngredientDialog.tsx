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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Ingredient, Supplier } from "@/lib/api-client"

interface AddSupplierIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
  ingredients: Ingredient[]
  onAddSupplierIngredient: (supplierIngredient: {
    supplierId: string
    ingredientId: string
    price: number
    leadTime: number
    minOrderQuantity: number
    notes: string
  }) => Promise<void>
}

export function AddSupplierIngredientDialog({
  open,
  onOpenChange,
  supplier,
  ingredients,
  onAddSupplierIngredient,
}: AddSupplierIngredientDialogProps) {
  const [supplierIngredientForm, setSupplierIngredientForm] = useState({
    supplierId: "",
    ingredientId: "",
    price: 0,
    leadTime: 1,
    minOrderQuantity: 1,
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when supplier changes
  useEffect(() => {
    if (supplier) {
      setSupplierIngredientForm(prev => ({
        ...prev,
        supplierId: supplier.id,
      }))
    }
  }, [supplier])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSupplierIngredientForm(prev => ({
        ...prev,
        ingredientId: "",
        price: 0,
        leadTime: 1,
        minOrderQuantity: 1,
        notes: "",
      }))
    }
  }, [open])

  const handleSubmit = async () => {
    if (!supplierIngredientForm.supplierId) {
      toast.error("Supplier is required")
      return
    }

    if (!supplierIngredientForm.ingredientId) {
      toast.error("Ingredient is required")
      return
    }

    if (supplierIngredientForm.price <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    try {
      setIsSubmitting(true)
      await onAddSupplierIngredient(supplierIngredientForm)
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding supplier ingredient:", error)
      toast.error("Failed to add supplier ingredient")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Supplier Ingredient</DialogTitle>
          <DialogDescription>
            Add a new ingredient for supplier {supplier?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-ingredient" className="text-right">
              Ingredient
            </Label>
            <Select
              value={supplierIngredientForm.ingredientId}
              onValueChange={(value) =>
                setSupplierIngredientForm({
                  ...supplierIngredientForm,
                  ingredientId: value,
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select ingredient" />
              </SelectTrigger>
              <SelectContent>
                {ingredients.map((ingredient) => (
                  <SelectItem key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-ingredient-price" className="text-right">
              Price
            </Label>
            <Input
              id="supplier-ingredient-price"
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
            <Label htmlFor="supplier-ingredient-lead-time" className="text-right">
              Lead Time (days)
            </Label>
            <Input
              id="supplier-ingredient-lead-time"
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
            <Label htmlFor="supplier-ingredient-min-order" className="text-right">
              Min Order Qty
            </Label>
            <Input
              id="supplier-ingredient-min-order"
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
            <Label htmlFor="supplier-ingredient-notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="supplier-ingredient-notes"
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
            {isSubmitting ? "Adding..." : "Add Ingredient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
