"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Star, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Filter menu items based on search query
  const filteredItems = (categoryId: string) => {
    return MENU_ITEMS.filter(item => 
      item.categoryId === categoryId && 
      (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  // Get random rating between 4.0 and 5.0
  const getRating = () => (4 + Math.random()).toFixed(1);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Link>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-full transition-all duration-300"
            />
          </div>
          
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
      </div>
      
      {/* Hero Banner */}
      <div className="relative h-[30vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 z-10" />
        <Image 
          src="/images/menu-banner.jpg" 
          alt="Menu Banner"
          fill
          className="object-cover"
        />
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Our Menu</h1>
            <p className="text-white/90 max-w-lg">
              Browse our delicious offerings and add items to your cart.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="main-dishes" className="mt-4">
          <TabsList className="mb-8 flex flex-wrap bg-background/50 p-1 rounded-full border border-primary/10">
            {MENU_CATEGORIES.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white rounded-full transition-all duration-300 px-6"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {MENU_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <motion.div 
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredItems(category.id).map((item, index) => {
                  const rating = getRating();
                  const isPopular = parseFloat(rating) >= 4.7;
                  
                  return (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
                        <div className="relative aspect-video w-full overflow-hidden">
                          <Image 
                            src={item.image || "/images/menu-placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {isPopular && (
                            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-primary to-secondary text-white border-none">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-primary">{item.name}</CardTitle>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{rating}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{item.description}</p>
                          <p className="mt-2 text-lg font-bold text-accent">{formatCurrency(item.price)}</p>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-full transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                            onClick={() => {
                              addItem({
                                id: item.id,
                                name: item.name,
                                price: item.price
                              });
                              toast.success(`${item.name} added to cart`, {
                                className: "bg-primary text-white",
                                position: "top-center"
                              });
                            }}
                          >
                            <Plus className="h-4 w-4" /> Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
              
              {filteredItems(category.id).length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">No items found matching your search.</p>
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
