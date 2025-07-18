"use client";

// UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, DollarSign, ShoppingBag, Users, Utensils } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="animate-slideInTop">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
          Dashboard
        </h1>
        <p className="text-foreground/80 text-lg">
          Welcome, <span className="font-medium text-primary">{user?.name || 'Admin'}</span> {user?.email ? 
            <span className="text-sm text-secondary/80">{`(${user.email})`}</span> : ''} to your restaurant management dashboard.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-scaleIn">
        <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Revenue</CardTitle>
            <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(15750000)}</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary/20 group-hover:bg-secondary transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Orders</CardTitle>
            <div className="p-1.5 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
              <ShoppingBag className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +12.4% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-accent/10 hover:border-accent/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 group-hover:bg-accent transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-accent">Customers</CardTitle>
            <div className="p-1.5 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
              <Users className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+249</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +18.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Active Staff</CardTitle>
            <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +2 since last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-fadeIn">
        <Card className="lg:col-span-4 border-primary/10 hover:border-primary/20 transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-70"></div>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
            <CardDescription className="text-foreground/70">
              You have received <span className="font-medium text-primary">24</span> orders this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order #{1000 + i}</p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1 ? "Just now" : `${i * 10} minutes ago`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(75000 * i)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i + 1} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 border-secondary/10 hover:border-secondary/20 transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-accent opacity-70"></div>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center gap-2">
              <Utensils className="h-5 w-5 text-secondary" />
              Popular Items
            </CardTitle>
            <CardDescription className="text-foreground/70">
              Your <span className="font-medium text-secondary">top selling</span> menu items this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Nasi Goreng Special", count: 42 },
                { name: "Ayam Bakar", count: 38 },
                { name: "Es Teh Manis", count: 30 },
                { name: "Sate Ayam", count: 28 },
                { name: "Es Jeruk", count: 25 },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/5 transition-all duration-300 hover-lift group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`rounded-full p-2 transition-colors duration-300 ${i === 0 ? 'bg-secondary/20' : i === 1 ? 'bg-accent/20' : 'bg-primary/10'}`}>
                    <span className={`text-xs font-bold ${i === 0 ? 'text-secondary' : i === 1 ? 'text-accent' : 'text-primary'}`}>
                      #{i + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-secondary transition-colors duration-300">{item.name}</p>
                    <p className="text-xs flex items-center gap-1 group-hover:text-secondary/70 transition-colors duration-300">
                      <span className="font-medium">{item.count}</span> orders this week
                    </p>
                  </div>
                  <div className="p-1 rounded-full group-hover:bg-secondary/10 transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Tabs defaultValue="daily">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Sales Overview</h2>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="daily" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="h-[300px] w-full rounded-md border">
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    Sales chart will be displayed here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="h-[300px] w-full rounded-md border">
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    Weekly sales chart will be displayed here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="monthly" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="h-[300px] w-full rounded-md border">
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    Monthly sales chart will be displayed here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
