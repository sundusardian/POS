import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Wallet } from "lucide-react";

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
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your order by providing your details and payment information.
        </p>
      </div>
      
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit-card">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="credit-card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="bank-transfer" className="flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </TabsTrigger>
                  <TabsTrigger value="e-wallet" className="flex items-center gap-2">
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
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ORDER_SUMMARY.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(ORDER_SUMMARY.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(ORDER_SUMMARY.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(ORDER_SUMMARY.total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Complete Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
