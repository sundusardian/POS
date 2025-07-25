"use client"

import { useState } from "react"
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
import { Stock } from "@/lib/api-client"
import { STOCK_MOVEMENT_TYPES } from "../constants"

interface AddStockMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stock: Stock | null
  onAddStockMovement: (stockMovement: {
    stockId: string
    quantity: number
    type: string
    notes: string
  }) => Promise<void>
}

export function AddStockMovementDialog({
  open,
  onOpenChange,
  stock,
  onAddStockMovement,
}: AddStockMovementDialogProps) {
  const [stockMovementForm, setStockMovementForm] = useState({
    stockId: "",
    quantity: 0,
    type: "add",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when stock changes
  useState(() => {
    if (stock) {
      setStockMovementForm(prev => ({
        ...prev,
        stockId: stock.id,
      }))
    }
  })

  const handleSubmit = async () => {
    if (!stockMovementForm.stockId) {
      toast.error("Stock ID is required")
      return
    }

    if (stockMovementForm.quantity <= 0) {
      toast.error("Quantity must be greater than 0")
      return
    }

    try {
      setIsSubmitting(true)
      await onAddStockMovement(stockMovementForm)
      onOpenChange(false)
      setStockMovementForm({
        stockId: "",
        quantity: 0,
        type: "add",
        notes: "",
      })
    } catch (error) {
      console.error("Error adding stock movement:", error)
      toast.error("Failed to add stock movement")
    } finally {
      setIsSubmitting(false)
    }
  }

  const stockInfo = stock ? `${stock.ingredient?.name || 'Unknown'} at ${stock.branch?.name || 'Unknown'}` : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock Movement</DialogTitle>
          <DialogDescription>
            Add a new stock movement to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Stock</Label>
            <div className="col-span-3 text-sm">
              {stockInfo || "No stock selected"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock-movement-type" className="text-right">
              Type
            </Label>
            <Select
              value={stockMovementForm.type}
              onValueChange={(value) =>
                setStockMovementForm({ ...stockMovementForm, type: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {STOCK_MOVEMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock-movement-quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="stock-movement-quantity"
              type="number"
              value={stockMovementForm.quantity}
              onChange={(e) =>
                setStockMovementForm({
                  ...stockMovementForm,
                  quantity: parseFloat(e.target.value) || 0,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock-movement-notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="stock-movement-notes"
              className="col-span-3"
              placeholder="Enter notes for this stock movement"
              value={stockMovementForm.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                setStockMovementForm({...stockMovementForm, notes: e.target.value})
              }
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
            {isSubmitting ? "Adding..." : "Add Stock Movement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
