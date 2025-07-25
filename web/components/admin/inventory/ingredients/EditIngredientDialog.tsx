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
import { Ingredient } from "@/lib/api-client"

// Define unit options directly since constants.ts might not be properly imported
const UNIT_OPTIONS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "l", label: "Liter (l)" },
  { value: "ml", label: "Milliliter (ml)" },
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "box", label: "Box" },
  { value: "bottle", label: "Bottle" },
  { value: "pack", label: "Pack" },
  { value: "can", label: "Can" },
  { value: "jar", label: "Jar" },
  { value: "sack", label: "Sack" },
]

// Define unit option type
interface UnitOption {
  value: string
  label: string
}

// Extended ingredient interface with minQuantity
interface ExtendedIngredient extends Ingredient {
  minQuantity?: number
  category?: string
}

interface EditIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient: ExtendedIngredient | null
  onEditIngredient: (id: string, ingredient: {
    name: string
    description: string
    unit: string
    minQuantity: number
    category: string
  }) => Promise<void>
}

export function EditIngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onEditIngredient,
}: EditIngredientDialogProps) {
  const [ingredientForm, setIngredientForm] = useState({
    name: "",
    description: "",
    unit: "kg",
    minQuantity: 10,
    category: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (ingredient) {
      setIngredientForm({
        name: ingredient.name,
        description: ingredient.description || "",
        unit: ingredient.unit,
        minQuantity: ingredient.minQuantity || 0,
        category: ingredient.category || "",
      })
    }
  }, [ingredient])

  const handleSubmit = async () => {
    if (!ingredient?.id || !ingredientForm.name) {
      toast.error("Ingredient name is required")
      return
    }

    try {
      setIsSubmitting(true)
      await onEditIngredient(ingredient.id, ingredientForm)
      onOpenChange(false)
    } catch (error) {
      console.error("Error editing ingredient:", error)
      toast.error("Failed to edit ingredient")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Reset form state when dialog closes
        if (!isOpen) {
          setIsSubmitting(false)
        }
        onOpenChange(isOpen)
      }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Ingredient</DialogTitle>
          <DialogDescription>
            Update ingredient information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-ingredient-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-ingredient-name"
              value={ingredientForm.name}
              onChange={(e) =>
                setIngredientForm({ ...ingredientForm, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-ingredient-description" className="text-right">
              Description
            </Label>
            <Input
              id="edit-ingredient-description"
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
            <Label htmlFor="edit-ingredient-unit" className="text-right">
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
                {UNIT_OPTIONS.map((option: UnitOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-ingredient-min-quantity" className="text-right">
              Min Quantity
            </Label>
            <Input
              id="edit-ingredient-min-quantity"
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
            <Label htmlFor="edit-ingredient-category" className="text-right">
              Category
            </Label>
            <Input
              id="edit-ingredient-category"
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
