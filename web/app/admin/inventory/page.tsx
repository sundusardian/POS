import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mock data for inventory items
const INVENTORY_ITEMS = [
  {
    id: 1,
    name: "Rice",
    category: "Grains",
    unit: "kg",
    quantity: 50,
    minQuantity: 10,
    price: 15000,
    supplier: "PT Beras Sejahtera",
    branch: "Main Branch",
  },
  {
    id: 2,
    name: "Chicken",
    category: "Meat",
    unit: "kg",
    quantity: 15,
    minQuantity: 5,
    price: 45000,
    supplier: "PT Ayam Segar",
    branch: "Main Branch",
  },
  {
    id: 3,
    name: "Cooking Oil",
    category: "Oil",
    unit: "liter",
    quantity: 20,
    minQuantity: 5,
    price: 25000,
    supplier: "PT Minyak Goreng",
    branch: "Main Branch",
  },
  {
    id: 4,
    name: "Sugar",
    category: "Sweeteners",
    unit: "kg",
    quantity: 10,
    minQuantity: 3,
    price: 18000,
    supplier: "PT Gula Manis",
    branch: "Main Branch",
  },
  {
    id: 5,
    name: "Tea Leaves",
    category: "Beverages",
    unit: "kg",
    quantity: 2,
    minQuantity: 1,
    price: 75000,
    supplier: "PT Teh Indonesia",
    branch: "Main Branch",
  },
  {
    id: 6,
    name: "Coffee Beans",
    category: "Beverages",
    unit: "kg",
    quantity: 3,
    minQuantity: 2,
    price: 120000,
    supplier: "PT Kopi Nusantara",
    branch: "Main Branch",
  },
  {
    id: 7,
    name: "Potatoes",
    category: "Vegetables",
    unit: "kg",
    quantity: 25,
    minQuantity: 10,
    price: 12000,
    supplier: "PT Sayur Segar",
    branch: "Main Branch",
  },
];

// Mock data for categories
const CATEGORIES = [
  { id: 1, name: "Grains" },
  { id: 2, name: "Meat" },
  { id: 3, name: "Oil" },
  { id: 4, name: "Sweeteners" },
  { id: 5, name: "Beverages" },
  { id: 6, name: "Vegetables" },
  { id: 7, name: "Fruits" },
  { id: 8, name: "Dairy" },
  { id: 9, name: "Spices" },
];

// Mock data for suppliers
const SUPPLIERS = [
  { id: 1, name: "PT Beras Sejahtera" },
  { id: 2, name: "PT Ayam Segar" },
  { id: 3, name: "PT Minyak Goreng" },
  { id: 4, name: "PT Gula Manis" },
  { id: 5, name: "PT Teh Indonesia" },
  { id: 6, name: "PT Kopi Nusantara" },
  { id: 7, name: "PT Sayur Segar" },
];

// Mock data for branches
const BRANCHES = [
  { id: 1, name: "Main Branch" },
  { id: 2, name: "Second Branch" },
  { id: 3, name: "Mall Branch" },
  { id: 4, name: "Bandung Branch" },
];

// Function to get stock level
const getStockLevel = (quantity: number, minQuantity: number) => {
  const ratio = quantity / minQuantity;
  if (ratio < 1) return "low";
  if (ratio < 2) return "medium";
  return "high";
};

export default function InventoryManagement() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s ingredients and stock.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="purchases">Purchase Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search inventory..."
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all-categories">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.name.toLowerCase()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-1">
                        <Plus className="h-4 w-4" /> Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Add New Inventory Item</DialogTitle>
                        <DialogDescription>
                          Add a new ingredient or item to your inventory.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Item Name</Label>
                          <Input id="name" placeholder="Enter item name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.name}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Select>
                              <SelectTrigger id="unit">
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="g">Gram (g)</SelectItem>
                                <SelectItem value="liter">Liter (L)</SelectItem>
                                <SelectItem value="ml">Milliliter (ml)</SelectItem>
                                <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                                <SelectItem value="box">Box</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="minQuantity">Minimum Quantity</Label>
                            <Input
                              id="minQuantity"
                              type="number"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="price">Price per Unit (IDR)</Label>
                            <Input
                              id="price"
                              type="number"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="supplier">Supplier</Label>
                            <Select>
                              <SelectTrigger id="supplier">
                                <SelectValue placeholder="Select supplier" />
                              </SelectTrigger>
                              <SelectContent>
                                {SUPPLIERS.map((supplier) => (
                                  <SelectItem
                                    key={supplier.id}
                                    value={supplier.name}
                                  >
                                    {supplier.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="branch">Branch</Label>
                          <Select>
                            <SelectTrigger id="branch">
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {BRANCHES.map((branch) => (
                                <SelectItem
                                  key={branch.id}
                                  value={branch.name}
                                >
                                  {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Item</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Unit</TableHead>
                    <TableHead className="hidden lg:table-cell">Price</TableHead>
                    <TableHead className="hidden lg:table-cell">Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVENTORY_ITEMS.map((item) => {
                    const stockLevel = getStockLevel(item.quantity, item.minQuantity);
                    const stockPercentage = Math.min(100, Math.round((item.quantity / item.minQuantity) * 50));
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={stockPercentage}
                              className={`h-2 w-[60px] ${
                                stockLevel === "low"
                                  ? "bg-red-100"
                                  : stockLevel === "medium"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                              }`}
                              indicatorClassName={
                                stockLevel === "low"
                                  ? "bg-red-500"
                                  : stockLevel === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }
                            />
                            <Badge
                              variant={
                                stockLevel === "low"
                                  ? "destructive"
                                  : stockLevel === "medium"
                                  ? "outline"
                                  : "default"
                              }
                              className="capitalize"
                            >
                              {stockLevel}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.unit}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {item.supplier}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Suppliers</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" /> Add Supplier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add New Supplier</DialogTitle>
                      <DialogDescription>
                        Add a new supplier for your inventory items.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="supplier-name">Supplier Name</Label>
                        <Input id="supplier-name" placeholder="Enter supplier name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact-person">Contact Person</Label>
                        <Input id="contact-person" placeholder="Enter contact person name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Enter phone number" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email address" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="Enter supplier address" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Supplier</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Manage your suppliers and their contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Contact Person</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SUPPLIERS.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell className="hidden md:table-cell">John Doe</TableCell>
                      <TableCell className="hidden md:table-cell">+62 812 3456 7890</TableCell>
                      <TableCell className="hidden lg:table-cell">contact@{supplier.name.toLowerCase().replace(/\s+/g, '')}.com</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Purchase Orders</CardTitle>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" /> New Purchase Order
                </Button>
              </div>
              <CardDescription>
                Manage your purchase orders and track deliveries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden md:table-cell">Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "PO-2025-001",
                      supplier: "PT Beras Sejahtera",
                      date: "2025-07-15",
                      items: 3,
                      total: 750000,
                      status: "delivered",
                    },
                    {
                      id: "PO-2025-002",
                      supplier: "PT Ayam Segar",
                      date: "2025-07-16",
                      items: 2,
                      total: 1250000,
                      status: "pending",
                    },
                    {
                      id: "PO-2025-003",
                      supplier: "PT Sayur Segar",
                      date: "2025-07-17",
                      items: 5,
                      total: 450000,
                      status: "processing",
                    },
                  ].map((order, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.items}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "processing"
                              ? "outline"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
