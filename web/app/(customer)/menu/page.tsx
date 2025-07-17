"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

// Mock data for menu items
const MENU_CATEGORIES = [
  { id: "main-dishes", name: "Main Dishes" },
  { id: "sides", name: "Sides" },
  { id: "beverages", name: "Beverages" },
  { id: "desserts", name: "Desserts" },
];

const MENU_ITEMS = [
  {
    id: 1,
    name: "Nasi Goreng Special",
    description: "Indonesian fried rice with chicken, egg, and vegetables",
    price: 45000,
    image: "/menu/nasi-goreng.jpg",
    categoryId: "main-dishes",
  },
  {
    id: 2,
    name: "Ayam Bakar",
    description: "Grilled chicken with special sauce",
    price: 55000,
    image: "/menu/ayam-bakar.jpg",
    categoryId: "main-dishes",
  },
  {
    id: 3,
    name: "Sate Ayam",
    description: "Chicken satay with peanut sauce",
    price: 35000,
    image: "/menu/sate-ayam.jpg",
    categoryId: "main-dishes",
  },
  {
    id: 4,
    name: "French Fries",
    description: "Crispy potato fries with ketchup",
    price: 25000,
    image: "/menu/french-fries.jpg",
    categoryId: "sides",
  },
  {
    id: 5,
    name: "Es Teh Manis",
    description: "Sweet iced tea",
    price: 10000,
    image: "/menu/es-teh.jpg",
    categoryId: "beverages",
  },
  {
    id: 6,
    name: "Es Jeruk",
    description: "Fresh orange juice",
    price: 15000,
    image: "/menu/es-jeruk.jpg",
    categoryId: "beverages",
  },
  {
    id: 7,
    name: "Pudding Coklat",
    description: "Chocolate pudding with vanilla sauce",
    price: 20000,
    image: "/menu/pudding.jpg",
    categoryId: "desserts",
  },
];

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function MenuPage() {
  const { addItem } = useCart();
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Our Menu</h1>
        <p className="text-muted-foreground">
          Browse our delicious offerings and add items to your cart.
        </p>
      </div>

      <Tabs defaultValue="main-dishes" className="mt-8">
        <TabsList className="mb-8 flex flex-wrap">
          {MENU_CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {MENU_CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MENU_ITEMS.filter(item => item.categoryId === category.id).map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    {/* Placeholder for actual images */}
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      {item.name} Image
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                    <p className="mt-2 text-lg font-bold">{formatCurrency(item.price)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2"
                      onClick={() => {
                        addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price
                        });
                        toast.success(`${item.name} added to cart`);
                      }}
                    >
                      <PlusCircle className="h-4 w-4" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
