"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IngredientsTab } from "./ingredients/IngredientsTab"
import { StocksTab } from "./stocks/StocksTab"
import { SuppliersTab } from "./suppliers/SuppliersTab"

export function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("ingredients")

  return (
    <div className="space-y-4">
      <Tabs defaultValue="ingredients" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredients" className="mt-6">
          <IngredientsTab />
        </TabsContent>
        <TabsContent value="stocks" className="mt-6">
          <StocksTab />
        </TabsContent>
        <TabsContent value="suppliers" className="mt-6">
          <SuppliersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
