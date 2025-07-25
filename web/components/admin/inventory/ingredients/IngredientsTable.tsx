"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"
import { Ingredient } from "@/lib/api-client"
import { getStockLevel } from "../utils"

interface IngredientsTableProps {
  ingredients: Ingredient[]
  ingredientSearch: string
  ingredientCategoryFilter: string
  onEditIngredient: (ingredient: Ingredient) => void
  onDeleteIngredient: (ingredient: Ingredient) => void
}

export function IngredientsTable({
  ingredients,
  ingredientSearch,
  ingredientCategoryFilter,
  onEditIngredient,
  onDeleteIngredient,
}: IngredientsTableProps) {
  // Filter ingredients based on search and category filter
  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(ingredientSearch.toLowerCase())
    const matchesCategory =
      !ingredientCategoryFilter ||
      ingredientCategoryFilter === "none" ||
      ingredient.category === ingredientCategoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Min Quantity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIngredients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No ingredients found
              </TableCell>
            </TableRow>
          ) : (
            filteredIngredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.description || "-"}</TableCell>
                <TableCell>{ingredient.unit}</TableCell>
                <TableCell>{ingredient.minQuantity}</TableCell>
                <TableCell>
                  {ingredient.category ? (
                    <Badge variant="outline">{ingredient.category}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditIngredient(ingredient)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteIngredient(ingredient)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
