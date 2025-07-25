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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Branch, Ingredient } from "@/lib/api-client"

interface AddStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredients: Ingredient[]
  branches: Branch[]
  onAddStock: (stockData: {
    ingredientId: string
    branchId: string
    quantity: number
  }) => Promise<void>
}

export function AddStockDialog({
  open,
  onOpenChange,
  ingredients,
  branches,
  onAddStock,
}: AddStockDialogProps) {
  const [stockForm, setStockForm] = useState({
    ingredientId: "",
    branchId: "",
    quantity: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setStockForm({
        ingredientId: "",
        branchId: "",
        quantity: 0,
      })
    }
  }, [open])

  const handleSubmit = async () => {
    if (!stockForm.ingredientId) {
      toast.error("Please select an ingredient")
      return
    }

    if (!stockForm.branchId) {
      toast.error("Please select a branch")
      return
    }

    if (stockForm.quantity <= 0) {
      toast.error("Quantity must be greater than 0")
      return
    }

    try {
      setIsSubmitting(true)
      await onAddStock(stockForm)
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding stock:", error)
      toast.error("Failed to add stock")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
          <DialogDescription>
            Add new stock for an ingredient at a specific branch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock-ingredient" className="text-right">
              Ingredient
            </Label>
            <Select
              value={stockForm.ingredientId}
              onValueChange={(value) =>
                setStockForm({ ...stockForm, ingredientId: value })
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
            <Label htmlFor="stock-branch" className="text-right">
              Branch
            </Label>
            <Select
              value={stockForm.branchId}
              onValueChange={(value) =>
                setStockForm({ ...stockForm, branchId: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock-quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="stock-quantity"
              type="number"
              value={stockForm.quantity}
              onChange={(e) =>
                setStockForm({
                  ...stockForm,
                  quantity: parseFloat(e.target.value) || 0,
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
            {isSubmitting ? "Adding..." : "Add Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
