"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Wallet, ArrowLeft, Check, ShoppingBag } from "lucide-react";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mock order summary data
const ORDER_SUMMARY = {
  items: [
    {
      id: 1,
      name: "Nasi Goreng Special",
      price: 45000,
      quantity: 2,
    },
    {
      id: 5,
      name: "Es Teh Manis",
      price: 10000,
      quantity: 3,
    },
  ],
  subtotal: 120000,
  tax: 12000,
  total: 132000,
};

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };
  
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
            <CardHeader className="text-center">
              <div className="mx-auto my-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Order Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Your order has been successfully placed.</p>
              <p className="font-medium">Order ID: <span className="text-primary">#IDR{Math.floor(Math.random() * 10000)}</span></p>
              <p className="mt-6 text-muted-foreground">A confirmation has been sent to your email.</p>
              
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-medium text-primary mb-2">Order Summary</h3>
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(ORDER_SUMMARY.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Tax</span>
                  <span>{formatCurrency(ORDER_SUMMARY.tax)}</span>
                </div>
                <Separator className="my-2 bg-primary/10" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-accent">{formatCurrency(ORDER_SUMMARY.total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/menu" className="w-full">
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-full transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/cart" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </Link>
          
          <h1 className="text-xl font-bold text-primary">Checkout</h1>
          
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
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
          {/* Customer Information */}
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-primary">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Enter your last name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Method */}
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-primary">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit-card">
                <TabsList className="grid w-full grid-cols-3 bg-primary/5 p-1">
                  <TabsTrigger value="credit-card" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all duration-300">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="bank-transfer" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all duration-300">
                    <Landmark className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </TabsTrigger>
                  <TabsTrigger value="e-wallet" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all duration-300">
                    <Wallet className="h-4 w-4" />
                    <span>E-Wallet</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit-card" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="Enter name as shown on card" />
                  </div>
                </TabsContent>
                
                <TabsContent value="bank-transfer" className="pt-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Bank Transfer Instructions</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Please transfer the total amount to the following bank account:
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                      <p><span className="font-semibold">Bank:</span> Bank Central Asia (BCA)</p>
                      <p><span className="font-semibold">Account Number:</span> 1234567890</p>
                      <p><span className="font-semibold">Account Name:</span> POS System Restaurant</p>
                      <p><span className="font-semibold">Amount:</span> {formatCurrency(ORDER_SUMMARY.total)}</p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      After making the transfer, please upload your payment receipt below:
                    </p>
                    <div className="mt-4">
                      <Input id="receipt" type="file" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="e-wallet" className="pt-4">
                  <RadioGroup defaultValue="gopay">
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value="gopay" id="gopay" />
                      <Label htmlFor="gopay" className="flex-1 cursor-pointer">GoPay</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value="ovo" id="ovo" />
                      <Label htmlFor="ovo" className="flex-1 cursor-pointer">OVO</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value="dana" id="dana" />
                      <Label htmlFor="dana" className="flex-1 cursor-pointer">DANA</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value="shopeepay" id="shopeepay" />
                      <Label htmlFor="shopeepay" className="flex-1 cursor-pointer">ShopeePay</Label>
                    </div>
                  </RadioGroup>
                  <div className="mt-4 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      After clicking &quot;Complete Order&quot;, you will be redirected to the selected e-wallet platform to complete your payment.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          </motion.div>
        
          {/* Order Summary */}
          <motion.div variants={itemVariants}>
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden sticky top-24">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ORDER_SUMMARY.items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors duration-200"
                    variants={itemVariants}
                  >
                    <span className="font-medium">
                      {item.name} <span className="text-muted-foreground">x {item.quantity}</span>
                    </span>
                    <span className="text-primary">{formatCurrency(item.price * item.quantity)}</span>
                  </motion.div>
                ))}
                <Separator className="bg-primary/10" />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(ORDER_SUMMARY.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(ORDER_SUMMARY.tax)}</span>
                </div>
                <Separator className="bg-primary/10" />
                <motion.div 
                  className="flex justify-between font-bold" 
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  <span>Total</span>
                  <span className="text-primary text-lg">{formatCurrency(ORDER_SUMMARY.total)}</span>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-full transition-all duration-300 hover:shadow-md hover:scale-[1.02]" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Processing...
                  </>
                ) : (
                  "Complete Order"
                )}
              </Button>
            </CardFooter>
          </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
