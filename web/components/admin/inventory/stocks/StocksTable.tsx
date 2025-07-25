"use client"

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
import { Edit, ListPlus } from "lucide-react"
import { Stock, Ingredient } from "@/lib/api-client"
import { getStockLevel } from "../utils"

// Extended ingredient interface with minQuantity
interface ExtendedIngredient extends Ingredient {
  minQuantity?: number
}

// Extended stock interface with extended ingredient
interface ExtendedStock extends Omit<Stock, 'ingredient'> {
  ingredient?: ExtendedIngredient
}

interface StocksTableProps {
  stocks: ExtendedStock[]
  stockSearch: string
  stockBranchFilter: string
  onAddStockMovement: (stock: ExtendedStock) => void
}

export function StocksTable({
  stocks,
  stockSearch,
  stockBranchFilter,
  onAddStockMovement,
}: StocksTableProps) {
  // Filter stocks based on search and branch filter
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = stock.ingredient?.name
      .toLowerCase()
      .includes(stockSearch.toLowerCase())
    const matchesBranch =
      !stockBranchFilter || stockBranchFilter === "none" || stock.branch?.id === stockBranchFilter
    return matchesSearch && matchesBranch
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ingredient</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStocks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No stocks found
              </TableCell>
            </TableRow>
          ) : (
            filteredStocks.map((stock) => {
              const stockLevel = getStockLevel(
                stock.quantity,
                stock.ingredient?.minQuantity || 0
              )
              
              return (
                <TableRow key={stock.id}>
                  <TableCell>{stock.ingredient?.name || "Unknown"}</TableCell>
                  <TableCell>{stock.branch?.name || "Unknown"}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{stock.ingredient?.unit || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        stockLevel === "low"
                          ? "destructive"
                          : stockLevel === "medium"
                          ? "outline"
                          : "default"
                      }
                    >
                      {stockLevel === "low"
                        ? "Low"
                        : stockLevel === "medium"
                        ? "Medium"
                        : "Good"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAddStockMovement(stock)}
                      >
                        <ListPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
