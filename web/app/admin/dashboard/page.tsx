"use client";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Icons
import { 
  ArrowUpRight, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Utensils, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Bell, 
  AlertTriangle
} from "lucide-react";

// Hooks and Contexts
import { useAuth } from "@/lib/auth-context";
import { useBaseWebSocket } from "@/lib/websocket";
import { useBranches, useOrders, useMenuItems, useTestData, useStaff } from "@/lib/hooks";
import { 
  useDashboardMetrics, 
  useRealtimeOrders, 
  useInventoryAlerts, 
  useStaffActivity, 
  useBranchPerformance 
} from "@/lib/websocket-hooks";

// Type Adapters
import { adaptOrdersToWebSocketType } from "@/lib/type-adapters";

// Utilities
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
  const { branches, isLoading: branchesLoading, error: branchesError, refetch: refetchBranches } = useBranches();
  const { orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders();
  const { menuItems, isLoading: menuLoading, error: menuError, refetch: refetchMenu } = useMenuItems();
  const { testData, isLoading: testLoading, refetch: refetchTestData } = useTestData();
  const { staff, isLoading: staffLoading } = useStaff();
  
  // Use our new WebSocket hooks for real-time data
  const { isConnected } = useBaseWebSocket();
  const { metrics, isLoading: metricsLoading } = useDashboardMetrics();
  
  // Use type adapter to fix type incompatibility
  const adaptedOrders = adaptOrdersToWebSocketType(orders);
  const { orders: realtimeOrders } = useRealtimeOrders(adaptedOrders);
  
  const { alerts, lowStockItems } = useInventoryAlerts();
  const { activities } = useStaffActivity(staff);
  const { performance } = useBranchPerformance(branches);

  // Calculate stats (use metrics from WebSocket if available, otherwise calculate from orders)
  const totalRevenue = metrics.totalRevenue || realtimeOrders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const activeOrders = metrics.activeOrders || realtimeOrders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(order.status)
  ).length;

  const completedToday = metrics.completedOrders || realtimeOrders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return orderDate === today && order.status === 'COMPLETED';
  }).length;

  // Event handler functions with proper typing
  const handleRefreshOrders = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refetchOrders();
    toast.success("Orders refreshed!");
  };

  const handleRefreshBranches = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refetchBranches();
    toast.success("Branches refreshed!");
  };

  const handleRefreshMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refetchMenu();
    toast.success("Menu items refreshed!");
  };

  const handleRefreshAll = () => {
    refetchBranches();
    refetchOrders();
    refetchMenu();
    refetchTestData();
    toast.success("All data refreshed!");
  };

  const isLoading = branchesLoading || ordersLoading || menuLoading || metricsLoading || staffLoading;
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
              <ArrowUpRight className={`h-3 w-3 ${metrics.totalRevenue ? 'animate-pulse' : ''}`} />
              Live data {metrics.totalRevenue ? '(updating)' : ''}
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
            <p className="text-xs flex items-center gap-1 text-secondary/80">
              {metrics.activeOrders ? <span className="inline-block h-2 w-2 rounded-full bg-secondary animate-ping"></span> : null}
              Currently processing
            </p>
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
            <p className="text-xs flex items-center gap-1 text-green-600">
              {metrics.completedOrders ? <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> : null}
              Orders completed today
            </p>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="test">Test Data</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Orders ({realtimeOrders.length})</CardTitle>
                  <CardDescription>Real-time order updates</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefreshOrders} className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Branches ({branches.length})</CardTitle>
                  <CardDescription>All restaurant branches</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefreshBranches} className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {branches.map((branch) => {
                  // Find branch performance data if available
                  const branchPerf = performance.find(p => p.branchId === branch.id);
                  
                  return (
                    <div key={branch.id} className="p-4 border rounded-lg hover:border-primary/30 transition-all">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{branch.name}</h3>
                        <Badge variant={branch.isActive ? "default" : "secondary"}>
                          {branch.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{branch.address}</p>
                      <p className="text-sm text-muted-foreground">{branch.phone}</p>
                      
                      {branchPerf && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span>Orders today:</span>
                            <span className="font-medium">{branchPerf.orders}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Revenue:</span>
                            <span className="font-medium text-green-600">{formatCurrency(branchPerf.revenue)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Inventory Alerts
                  {alerts.length > 0 && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>}
                </CardTitle>
                <CardDescription>Real-time inventory status alerts</CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No alerts at this time</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-amber-50 border-amber-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-amber-800">{alert.type}</div>
                            <div className="text-sm text-amber-700">{alert.message}</div>
                          </div>
                          <div className="text-xs text-amber-600">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  Low Stock Items
                  {lowStockItems.length > 0 && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
                </CardTitle>
                <CardDescription>Items that need to be restocked</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">All stock levels are normal</p>
                ) : (
                  <div className="space-y-3">
                    {lowStockItems.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-red-50 border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-red-800">{item.name || `Ingredient #${item.ingredientId}`}</div>
                            <div className="text-sm text-red-700">Quantity: {item.quantity}</div>
                          </div>
                          <Badge variant="destructive">{item.status.toUpperCase()}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Staff Activity
                {activities.length > 0 && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
              </CardTitle>
              <CardDescription>Real-time staff activity monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent staff activity</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-slate-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{activity.staffName?.substring(0, 2) || 'ST'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{activity.staffName || `Staff #${activity.staffId}`}</div>
                              <div className="text-sm text-muted-foreground">{activity.activity}</div>
                            </div>
                          </div>
                          <div>
                            <Badge variant="secondary">
                              {activity.activity.includes('login') ? 'Online' : 'Active'}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Menu Items ({menuItems.length})</CardTitle>
                  <CardDescription>All available menu items</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefreshMenu} className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="mt-2 font-medium">{formatCurrency(item.price)}</p>
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
