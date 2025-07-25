"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"
import { SupplierIngredient } from "@/lib/api-client"
import { formatCurrency } from "../utils"

interface SupplierIngredientsTableProps {
  supplierIngredients: SupplierIngredient[]
  supplierIngredientSearch: string
  onEditSupplierIngredient: (supplierIngredient: SupplierIngredient) => void
  onDeleteSupplierIngredient: (supplierIngredient: SupplierIngredient) => void
}

export function SupplierIngredientsTable({
  supplierIngredients,
  supplierIngredientSearch,
  onEditSupplierIngredient,
  onDeleteSupplierIngredient,
}: SupplierIngredientsTableProps) {
  // Filter supplier ingredients based on search
  const filteredSupplierIngredients = supplierIngredients.filter((si) =>
    si.ingredient?.name.toLowerCase().includes(supplierIngredientSearch.toLowerCase())
  )

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ingredient</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Lead Time (days)</TableHead>
            <TableHead>Min Order Qty</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSupplierIngredients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No supplier ingredients found
              </TableCell>
            </TableRow>
          ) : (
            filteredSupplierIngredients.map((supplierIngredient) => (
              <TableRow key={supplierIngredient.id}>
                <TableCell>
                  {supplierIngredient.ingredient?.name || "Unknown"}
                </TableCell>
                <TableCell>
                  {formatCurrency(supplierIngredient.price)}
                </TableCell>
                <TableCell>
                  {supplierIngredient.leadTime || "-"}
                </TableCell>
                <TableCell>
                  {supplierIngredient.minOrderQuantity || "-"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {supplierIngredient.notes || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditSupplierIngredient(supplierIngredient)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteSupplierIngredient(supplierIngredient)}
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
