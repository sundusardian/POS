"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { 
  Stock, 
  useStocks, 
  useIngredients, 
  useBranches, 
  useStockMutations 
} from "@/lib/hooks"
import { AddStockDialog } from "./AddStockDialog"
import { AddStockMovementDialog } from "./AddStockMovementDialog"
import { StocksTable } from "./StocksTable"

export function StocksTab() {
  // State for search and filter
  const [stockSearch, setStockSearch] = useState("")
  const [stockBranchFilter, setStockBranchFilter] = useState("none")
  
  // State for dialogs
  const [addStockOpen, setAddStockOpen] = useState(false)
  const [addStockMovementOpen, setAddStockMovementOpen] = useState(false)
  const [currentStock, setCurrentStock] = useState<Stock | null>(null)

  // Fetch data
  const { data: stocks, isLoading, error, mutate: refetchStocks } = useStocks()
  const { data: ingredients, isLoading: isLoadingIngredients } = useIngredients()
  const { data: branches, isLoading: isLoadingBranches } = useBranches()
  
  // Stock mutations
  const { createStock, createStockMovement } = useStockMutations()

  // Handle add stock
  const handleAddStock = async (stockData: {
    ingredientId: string
    branchId: string
    quantity: number
  }) => {
    try {
      await createStock(stockData)
      toast.success("Stock added successfully")
      refetchStocks()
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding stock:", error)
      toast.error("Failed to add stock")
      return Promise.reject(error)
    }
  }

  // Handle add stock movement
  const handleAddStockMovement = async (stockMovement: {
    stockId: string
    quantity: number
    type: string
    notes: string
  }) => {
    try {
      await createStockMovement(stockMovement)
      toast.success("Stock movement added successfully")
      refetchStocks()
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding stock movement:", error)
      toast.error("Failed to add stock movement")
      return Promise.reject(error)
    }
  }

  // Open add stock movement dialog
  const openAddStockMovementDialog = (stock: Stock) => {
    setCurrentStock(stock)
    setAddStockMovementOpen(true)
  }

  const isDataLoading = isLoading || isLoadingIngredients || isLoadingBranches

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Search stocks..."
            value={stockSearch}
            onChange={(e) => setStockSearch(e.target.value)}
            className="w-[250px]"
          />
          <Select
            value={stockBranchFilter}
            onValueChange={setStockBranchFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Branches</SelectItem>
              {branches?.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchStocks()}
            disabled={isDataLoading}
          >
            {isDataLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={() => setAddStockOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Stock
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex justify-center p-4 text-destructive">
          Error loading stocks. Please try again.
        </div>
      ) : isDataLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <StocksTable
          stocks={stocks || []}
          stockSearch={stockSearch}
          stockBranchFilter={stockBranchFilter}
          onAddStockMovement={openAddStockMovementDialog}
        />
      )}

      {/* Dialogs */}
      <AddStockDialog
        open={addStockOpen}
        onOpenChange={setAddStockOpen}
        ingredients={ingredients || []}
        branches={branches || []}
        onAddStock={handleAddStock}
      />
      
      <AddStockMovementDialog
        open={addStockMovementOpen}
        onOpenChange={setAddStockMovementOpen}
        stock={currentStock}
        onAddStockMovement={handleAddStockMovement}
      />
    </div>
  )
}
