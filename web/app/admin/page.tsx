"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, DollarSign, ShoppingBag, Users, Utensils, Wifi, WifiOff, RefreshCw, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useAuth } from '@/lib/auth-context';
import { useWebSocket } from '@/lib/websocket-context';
import { useBranches, useOrders, useMenuItems, useDesks, useCategories } from '@/lib/hooks';
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

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
  const { isConnected } = useWebSocket();
  const { branches, isLoading: branchesLoading, error: branchesError, refetch: refetchBranches } = useBranches();
  const { orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders();
  const { menuItems, isLoading: menuLoading, error: menuError, refetch: refetchMenu } = useMenuItems();
  const { categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  const { desks, isLoading: desksLoading, refetch: refetchDesks } = useDesks();
  
  const [realtimeOrders, setRealtimeOrders] = useState(orders);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  // Update realtime orders when orders data changes
  useEffect(() => {
    setRealtimeOrders(orders);
    setLastUpdate(new Date());
  }, [orders]);

  // Handle WebSocket events
  useEffect(() => {
    const handleOrderCreated = (order: any) => {
      setRealtimeOrders(prev => [order, ...prev]);
      setLastUpdate(new Date());
      toast.success(`New order #${order.id} created!`);
    };

    const handleOrderStatusChanged = (data: any) => {
      setRealtimeOrders(prev => 
        prev.map(order => 
          order.id === data.orderId 
            ? { ...order, status: data.status }
            : order
        )
      );
      setLastUpdate(new Date());
      toast.info(`Order #${data.orderId} status changed to ${data.status}`);
    };

    // Note: In a real implementation, you'd add these event listeners to the WebSocket
    return () => {
      // Cleanup event listeners
    };
  }, []);

  // Calculate real-time stats
  const totalRevenue = realtimeOrders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + (+order.totalAmount || 0), 0);

  const activeOrders = realtimeOrders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(order.status)
  ).length;

  const completedToday = realtimeOrders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return orderDate === today && order.status === 'COMPLETED';
  }).length;

  const pendingOrders = realtimeOrders.filter(order => order.status === 'PENDING').length;

  const handleRefreshAll = () => {
    refetchBranches();
    refetchOrders();
    refetchMenu();
    refetchCategories();
    refetchDesks();
    setLastUpdate(new Date());
    toast.success("Dashboard refreshed!");
  };

  const isLoading = branchesLoading || ordersLoading || menuLoading || categoriesLoading || desksLoading;
  const hasError = branchesError || ordersError || menuError || categoriesError;
  
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="animate-slideInTop flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
            Dashboard Overview
          </h1>
          <p className="text-foreground/80 text-lg">
            Welcome, <span className="font-medium text-primary">{user?.name || 'Admin'}</span>
            {user?.email && <span className="text-sm text-secondary/80"> ({user.email})</span>}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {isConnected ? (
              <Badge variant="default" className="bg-green-500">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Updated {lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshAll} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/admin/dashboard">
            <Button>
              <TrendingUp className="h-4 w-4 mr-2" />
              Detailed Analytics
            </Button>
          </Link>
        </div>
      </div>

      {hasError && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">System Status</CardTitle>
            <CardDescription className="text-red-600">
              {branchesError && <div>Branches API: {branchesError}</div>}
              {ordersError && <div>Orders API: {ordersError}</div>}
              {menuError && <div>Menu API: {menuError}</div>}
              {categoriesError && <div>Categories API: {categoriesError}</div>}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
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
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              Live revenue data
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary/20 group-hover:bg-secondary transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Active Orders</CardTitle>
            <div className="p-1.5 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
              <ShoppingBag className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-secondary/80">
              Currently processing
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-accent/10 hover:border-accent/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 group-hover:bg-accent transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-accent">Completed Today</CardTitle>
            <div className="p-1.5 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
              <Users className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-green-600">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Orders completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Menu Items</CardTitle>
            <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Utensils className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold">{menuItems?.length || 0}</CardTitle>
            <CardDescription>Menu Items</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold">{categories?.length || 0}</CardTitle>
            <CardDescription>Menu Categories</CardDescription>
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
              You have <span className="font-medium text-primary">{realtimeOrders.length}</span> total orders with <span className="font-medium text-secondary">{pendingOrders}</span> pending.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realtimeOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders found</p>
              ) : (
                realtimeOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order #{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerName} • {order.branch?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          order.status === 'COMPLETED' ? 'default' :
                          order.status === 'CANCELLED' ? 'destructive' :
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        {formatCurrency(order.totalAmount || 0)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 border-secondary/10 hover:border-secondary/20 transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-accent opacity-70"></div>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center gap-2">
              <Utensils className="h-5 w-5 text-secondary" />
              Menu Items
            </CardTitle>
            <CardDescription className="text-foreground/70">
              Your <span className="font-medium text-secondary">{menuItems.length}</span> available menu items across <span className="font-medium text-primary">{branches.length}</span> branches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No menu items found</p>
              ) : (
                menuItems.slice(0, 5).map((item, i) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/5 transition-all duration-300 hover-lift group"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`rounded-full p-2 transition-colors duration-300 ${i === 0 ? 'bg-secondary/20' : i === 1 ? 'bg-accent/20' : 'bg-primary/10'}`}>
                      <Utensils className={`h-3 w-3 ${i === 0 ? 'text-secondary' : i === 1 ? 'text-accent' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-secondary transition-colors duration-300">{item.name}</p>
                      <p className="text-xs flex items-center gap-1 group-hover:text-secondary/70 transition-colors duration-300">
                        <span className="font-medium">{formatCurrency(item.price)}</span> • {item.category?.name}
                      </p>
                    </div>
                    <div className="p-1 rounded-full group-hover:bg-secondary/10 transition-all duration-300">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors duration-300" />
                    </div>
                  </div>
                ))
              )}
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
