"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import {Loader2, Plus, RefreshCw} from "lucide-react"
import {toast} from "sonner"
import {useIngredientMutations, useIngredients} from "@/lib/hooks"
import {AddIngredientDialog} from "./AddIngredientDialog"
import {EditIngredientDialog} from "./EditIngredientDialog"
import {DeleteIngredientDialog} from "./DeleteIngredientDialog"
import {IngredientsTable} from "./IngredientsTable"
import {CreateIngredientDto, Ingredient, UpdateIngredientDto} from "@/lib/api-client"

export function IngredientsTab() {
   // State for search and filter
   const [ingredientSearch, setIngredientSearch] = useState("")
   const [ingredientCategoryFilter, setIngredientCategoryFilter] =
      useState("none")

   // State for dialogs
   const [addIngredientOpen, setAddIngredientOpen] = useState(false)
   const [editIngredientOpen, setEditIngredientOpen] = useState(false)
   const [deleteIngredientOpen, setDeleteIngredientOpen] = useState(false)
   const [currentIngredient, setCurrentIngredient] =
      useState<Ingredient | null>(null)

   // Fetch ingredients data
   const {
      ingredients,
      isLoading,
      error,
      refetch: refetchIngredients,
   } = useIngredients()

   // Ingredient mutations
   const {createIngredient, updateIngredient, deleteIngredient} =
      useIngredientMutations()

   // Handle add ingredient
   const handleAddIngredient = async (ingredientData: {
      name: string
      description: string
      unit: string
      minQuantity: number
      category: string
   }) => {
      try {
         await createIngredient(ingredientData as unknown as CreateIngredientDto)
         toast.success("Ingredient added successfully")
         refetchIngredients()
         return Promise.resolve()
      } catch (error) {
         console.error("Error adding ingredient:", error)
         toast.error("Failed to add ingredient")
         return Promise.reject(error)
      }
   }

   // Handle edit ingredient
   const handleEditIngredient = async (
      id: string,
      ingredientData: {
         name: string
         description: string
         unit: string
         minQuantity: number
         category: string
      }
   ) => {
      try {
         await updateIngredient(id, ingredientData as unknown as UpdateIngredientDto)
         toast.success("Ingredient updated successfully")
         refetchIngredients()
         return Promise.resolve()
      } catch (error) {
         console.error("Error updating ingredient:", error)
         toast.error("Failed to update ingredient")
         return Promise.reject(error)
      }
   }

   // Handle delete ingredient
   const handleDeleteIngredient = async (id: string) => {
      try {
         await deleteIngredient(id)
         toast.success("Ingredient deleted successfully")
         refetchIngredients()
         return Promise.resolve()
      } catch (error) {
         console.error("Error deleting ingredient:", error)
         toast.error("Failed to delete ingredient")
         return Promise.reject(error)
      }
   }

   // Open edit dialog
   const openEditDialog = (ingredient: Ingredient) => {
      setCurrentIngredient(ingredient)
      setEditIngredientOpen(true)
   }

   // Open delete dialog
   const openDeleteDialog = (ingredient: Ingredient) => {
      setCurrentIngredient(ingredient)
      setDeleteIngredientOpen(true)
   }

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <div className="flex space-x-2">
               <Input
                  placeholder="Search ingredients..."
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                  className="w-[250px]"
               />
               <Select
                  value={ingredientCategoryFilter}
                  onValueChange={setIngredientCategoryFilter}
               >
                  <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="none">All Categories</SelectItem>
                     {Array.from(
                        new Set(
                           ingredients?.map((i) => i.category).filter(Boolean)
                        )
                     )?.map((category) => (
                        <SelectItem key={category} value={category || ""}>
                           {category}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="flex space-x-2">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetchIngredients()}
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <RefreshCw className="h-4 w-4" />
                  )}
               </Button>
               <Button onClick={() => setAddIngredientOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Ingredient
               </Button>
            </div>
         </div>

         {error ? (
            <div className="flex justify-center p-4 text-destructive">
               Error loading ingredients. Please try again.
            </div>
         ) : isLoading ? (
            <div className="flex justify-center p-8">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
         ) : (
            <IngredientsTable
               ingredients={ingredients || []}
               ingredientSearch={ingredientSearch}
               ingredientCategoryFilter={ingredientCategoryFilter}
               onEditIngredient={openEditDialog}
               onDeleteIngredient={openDeleteDialog}
            />
         )}

         {/* Dialogs */}
         <AddIngredientDialog
            open={addIngredientOpen}
            onOpenChange={setAddIngredientOpen}
            onAddIngredient={handleAddIngredient}
         />

         <EditIngredientDialog
            open={editIngredientOpen}
            onOpenChange={setEditIngredientOpen}
            ingredient={currentIngredient}
            onEditIngredient={handleEditIngredient}
         />

         <DeleteIngredientDialog
            open={deleteIngredientOpen}
            onOpenChange={setDeleteIngredientOpen}
            ingredient={currentIngredient}
            onDeleteIngredient={handleDeleteIngredient}
         />
      </div>
   )
}
