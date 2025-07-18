"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, MinusCircle, PlusCircle, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};



export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, tax, total } = useCart();
  const [mounted, setMounted] = useState(false);
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/menu" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Menu</span>
          </Link>
          
          <h1 className="text-xl font-bold text-primary">Your Cart</h1>
          
          <div className="w-20"></div> {/* Empty div for balance */}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-4 grid gap-8 md:grid-cols-3"
        >
          <div className="md:col-span-2">
            <AnimatePresence>
              {items.length > 0 ? (
                <motion.div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                    >
                      <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-primary">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.price)} per item
                              </p>
                              <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                {item.quantity} {item.quantity > 1 ? 'items' : 'item'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 border border-primary/20 rounded-full p-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                  <span className="sr-only">Decrease quantity</span>
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                  <span className="sr-only">Increase quantity</span>
                                </Button>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive h-8 w-8 rounded-full hover:bg-destructive/10 transition-colors"
                                onClick={() => {
                                  removeItem(item.id);
                                  toast.success(`${item.name} removed from cart`, {
                                    className: "bg-primary text-white",
                                    position: "top-center"
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove item</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center rounded-lg border border-dashed border-primary/20 p-12 text-center bg-gradient-to-b from-background to-primary/5"
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/10 opacity-75"></div>
                    <ShoppingBag className="h-16 w-16 text-primary/50 relative z-10" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-primary">Your cart is empty</h3>
                  <p className="mt-2 text-muted-foreground max-w-md">
                    Add items from the menu to get started with your delicious order.
                  </p>
                  <Link href="/menu" className="mt-6">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-full px-8 py-6 h-auto transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                      Browse Menu
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div>
            <motion.div variants={itemVariants}>
              <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    Order Summary
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <Separator className="bg-primary/10" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-accent">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-full transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex items-center gap-2" 
                    size="lg" 
                    asChild
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6 border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
                <CardHeader>
                  <CardTitle className="text-primary">Promo Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter code" 
                      className="border-primary/20 focus:border-primary focus:ring-primary/20 rounded-full transition-all duration-300"
                    />
                    <Button 
                      variant="outline" 
                      className="border-primary/20 hover:border-primary hover:bg-primary/5 text-primary rounded-full transition-all duration-300"
                    >
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
