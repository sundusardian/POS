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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { UNIT_OPTIONS } from "../constants"

interface AddIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddIngredient: (ingredient: {
    name: string
    description: string
    unit: string
    minQuantity: number
    category: string
  }) => Promise<void>
}

export function AddIngredientDialog({
  open,
  onOpenChange,
  onAddIngredient,
}: AddIngredientDialogProps) {
  const [ingredientForm, setIngredientForm] = useState({
    name: "",
    description: "",
    unit: "kg",
    minQuantity: 10,
    category: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!ingredientForm.name) {
      toast.error("Ingredient name is required")
      return
    }

    try {
      setIsSubmitting(true)
      await onAddIngredient(ingredientForm)
      setIngredientForm({
        name: "",
        description: "",
        unit: "kg",
        minQuantity: 10,
        category: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding ingredient:", error)
      toast.error("Failed to add ingredient")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Ingredient</DialogTitle>
          <DialogDescription>
            Add a new ingredient to the inventory.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredient-name" className="text-right">
              Name
            </Label>
            <Input
              id="ingredient-name"
              value={ingredientForm.name}
              onChange={(e) =>
                setIngredientForm({ ...ingredientForm, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredient-description" className="text-right">
              Description
            </Label>
            <Input
              id="ingredient-description"
              value={ingredientForm.description}
              onChange={(e) =>
                setIngredientForm({
                  ...ingredientForm,
                  description: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredient-unit" className="text-right">
              Unit
            </Label>
            <Select
              value={ingredientForm.unit}
              onValueChange={(value) =>
                setIngredientForm({ ...ingredientForm, unit: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredient-min-quantity" className="text-right">
              Min Quantity
            </Label>
            <Input
              id="ingredient-min-quantity"
              type="number"
              value={ingredientForm.minQuantity}
              onChange={(e) =>
                setIngredientForm({
                  ...ingredientForm,
                  minQuantity: parseInt(e.target.value) || 0,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredient-category" className="text-right">
              Category
            </Label>
            <Input
              id="ingredient-category"
              value={ingredientForm.category}
              onChange={(e) =>
                setIngredientForm({
                  ...ingredientForm,
                  category: e.target.value,
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
