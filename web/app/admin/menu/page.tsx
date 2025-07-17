import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Search, Trash2 } from "lucide-react";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mock data for menu items
const MENU_ITEMS = [
  {
    id: 1,
    name: "Nasi Goreng Special",
    description: "Indonesian fried rice with chicken, egg, and vegetables",
    price: 45000,
    category: "Main Dishes",
    status: "active",
  },
  {
    id: 2,
    name: "Ayam Bakar",
    description: "Grilled chicken with special sauce",
    price: 55000,
    category: "Main Dishes",
    status: "active",
  },
  {
    id: 3,
    name: "Sate Ayam",
    description: "Chicken satay with peanut sauce",
    price: 35000,
    category: "Main Dishes",
    status: "active",
  },
  {
    id: 4,
    name: "French Fries",
    description: "Crispy potato fries with ketchup",
    price: 25000,
    category: "Sides",
    status: "active",
  },
  {
    id: 5,
    name: "Es Teh Manis",
    description: "Sweet iced tea",
    price: 10000,
    category: "Beverages",
    status: "active",
  },
  {
    id: 6,
    name: "Es Jeruk",
    description: "Fresh orange juice",
    price: 15000,
    category: "Beverages",
    status: "active",
  },
  {
    id: 7,
    name: "Pudding Coklat",
    description: "Chocolate pudding with vanilla sauce",
    price: 20000,
    category: "Desserts",
    status: "inactive",
  },
];

// Mock data for categories
const CATEGORIES = [
  { id: 1, name: "Main Dishes", itemCount: 3 },
  { id: 2, name: "Sides", itemCount: 1 },
  { id: 3, name: "Beverages", itemCount: 2 },
  { id: 4, name: "Desserts", itemCount: 1 },
];

export default function MenuManagement() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s menu items and categories.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search menu items..."
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
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
                        <DialogTitle>Add New Menu Item</DialogTitle>
                        <DialogDescription>
                          Create a new item for your restaurant menu.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Item Name</Label>
                          <Input id="name" placeholder="Enter item name" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Enter item description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="price">Price (IDR)</Label>
                            <Input
                              id="price"
                              type="number"
                              placeholder="0"
                              min="0"
                            />
                          </div>
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
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="image">Image</Label>
                          <Input id="image" type="file" />
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
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MENU_ITEMS.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="hidden max-w-[300px] truncate md:table-cell">
                        {item.description}
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "active" ? "default" : "secondary"}
                        >
                          {item.status === "active" ? "Active" : "Inactive"}
                        </Badge>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search categories..."
                    className="pl-8"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" /> Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>
                        Create a new category for your menu items.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input id="category-name" placeholder="Enter category name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-description">Description (Optional)</Label>
                        <Textarea
                          id="category-description"
                          placeholder="Enter category description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CATEGORIES.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.itemCount}</TableCell>
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
      </Tabs>
    </div>
  );
}
