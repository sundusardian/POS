"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, MinusCircle, PlusCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

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
  
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="text-muted-foreground">
          Review your items before proceeding to checkout.
        </p>
      </div>
      
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} per item
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <MinusCircle className="h-4 w-4" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => {
                            removeItem(item.id);
                            toast.success(`${item.name} removed from cart`);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add items from the menu to get started.
              </p>
              <Link href="/menu" className="mt-4">
                <Button>Browse Menu</Button>
              </Link>
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Enter code" />
                <Button variant="outline">Apply</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
