"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, DollarSign, ShoppingBag, Users, Utensils, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useWebSocket } from "@/lib/websocket-context";
import { useBranches, useOrders, useMenuItems, useTestData } from "@/lib/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function IntegratedDashboard() {
  const { user } = useAuth();
  const { isConnected } = useWebSocket();
  const { branches, isLoading: branchesLoading, error: branchesError, refetch: refetchBranches } = useBranches();
  const { orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders();
  const { menuItems, isLoading: menuLoading, error: menuError, refetch: refetchMenu } = useMenuItems();
  const { testData, isLoading: testLoading, refetch: refetchTestData } = useTestData();
  
  const [realtimeOrders, setRealtimeOrders] = useState(orders);

  // Update realtime orders when orders data changes
  useEffect(() => {
    setRealtimeOrders(orders);
  }, [orders]);

  // Handle WebSocket events
  useEffect(() => {
    const handleOrderCreated = (order: any) => {
      setRealtimeOrders(prev => [order, ...prev]);
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
      toast.info(`Order #${data.orderId} status changed to ${data.status}`);
    };

    const handleOrderCancelled = (data: any) => {
      setRealtimeOrders(prev => 
        prev.map(order => 
          order.id === data.orderId 
            ? { ...order, status: 'CANCELLED' }
            : order
        )
      );
      toast.error(`Order #${data.orderId} was cancelled`);
    };

    // Note: In a real implementation, you'd add these event listeners to the WebSocket
    // For now, we'll just set up the handlers
    
    return () => {
      // Cleanup event listeners
    };
  }, []);

  // Calculate stats
  const totalRevenue = realtimeOrders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const activeOrders = realtimeOrders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(order.status)
  ).length;

  const completedToday = realtimeOrders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return orderDate === today && order.status === 'COMPLETED';
  }).length;

  const handleRefreshAll = () => {
    refetchBranches();
    refetchOrders();
    refetchMenu();
    refetchTestData();
    toast.success("Data refreshed!");
  };

  const isLoading = branchesLoading || ordersLoading || menuLoading;
  const hasErrors = branchesError || ordersError || menuError;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="animate-slideInTop flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
            Live Dashboard
          </h1>
          <p className="text-foreground/80 text-lg">
            Welcome, <span className="font-medium text-primary">{user?.name || 'Admin'}</span>
            {user?.email && <span className="text-sm text-secondary/80"> ({user.email})</span>}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {isConnected ? (
              <Badge variant="default" className="bg-green-500">
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
            <Badge variant="outline">
              {branches.length} Branch{branches.length !== 1 ? 'es' : ''}
            </Badge>
          </div>
        </div>
        <Button onClick={handleRefreshAll} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {hasErrors && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Connection Issues</CardTitle>
            <CardDescription className="text-red-600">
              {branchesError && <div>Branches: {branchesError}</div>}
              {ordersError && <div>Orders: {ordersError}</div>}
              {menuError && <div>Menu: {menuError}</div>}
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
              Live data
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
            <p className="text-xs text-secondary/80">Currently processing</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/10 hover:border-green-500/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 group-hover:bg-green-500 transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Completed Today</CardTitle>
            <div className="p-1.5 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-green-600">Orders completed</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover-lift overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/20 group-hover:bg-orange-500 transition-colors duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Menu Items</CardTitle>
            <div className="p-1.5 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300">
              <Utensils className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-orange-600">Available items</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="test">Test Data</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders ({realtimeOrders.length})</CardTitle>
              <CardDescription>Real-time order updates</CardDescription>
            </CardHeader>
            <CardContent>
              {realtimeOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders found</p>
              ) : (
                <div className="space-y-2">
                  {realtimeOrders.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Order #{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerName} • {order.branch?.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            order.status === 'COMPLETED' ? 'default' :
                            order.status === 'CANCELLED' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {order.status}
                        </Badge>
                        <div className="text-sm font-medium mt-1">
                          {formatCurrency(order.totalAmount || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branches ({branches.length})</CardTitle>
              <CardDescription>All restaurant branches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {branches.map((branch) => (
                  <div key={branch.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{branch.name}</h3>
                    <p className="text-sm text-muted-foreground">{branch.address}</p>
                    <p className="text-sm text-muted-foreground">{branch.phone}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items ({menuItems.length})</CardTitle>
              <CardDescription>Available menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.slice(0, 12).map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category?.name}</p>
                    <p className="text-sm font-medium text-primary mt-2">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Data</CardTitle>
              <CardDescription>Development test data from backend</CardDescription>
            </CardHeader>
            <CardContent>
              {testLoading ? (
                <p>Loading test data...</p>
              ) : testData ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Branches: {testData.branches?.length || 0}</h4>
                    <h4 className="font-medium">Desks: {testData.desks?.length || 0}</h4>
                    <h4 className="font-medium">Menu Items: {testData.menuItems?.length || 0}</h4>
                    <h4 className="font-medium">Users: {testData.users?.length || 0}</h4>
                  </div>
                  <Button onClick={() => refetchTestData()} variant="outline">
                    Refresh Test Data
                  </Button>
                </div>
              ) : (
                <p>No test data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
