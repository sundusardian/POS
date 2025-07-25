'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, RefreshCw, AlertCircle, Eye, X, CheckCircle, Clock, ChefHat, Utensils } from "lucide-react";
import { toast } from 'sonner';
import { useOrders, useBranches, useMenuItems, useDesks, useOrderMutations } from '@/lib/hooks';
import { Order } from '@/lib/api-client';

// Order status configuration
const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
  { value: 'PREPARING', label: 'Preparing', icon: ChefHat, color: 'bg-orange-100 text-orange-800' },
  { value: 'READY', label: 'Ready', icon: Utensils, color: 'bg-green-100 text-green-800' },
  { value: 'SERVED', label: 'Served', icon: CheckCircle, color: 'bg-purple-100 text-purple-800' },
  { value: 'COMPLETED', label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', icon: X, color: 'bg-red-100 text-red-800' },
];

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date and time
const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export default function OrderManagement() {
  // Data fetching
  const { branches } = useBranches();
  const { menuItems } = useMenuItems();
  const { desks } = useDesks();
  const { orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders();
  const { createOrder, updateOrderStatus, cancelOrder } = useOrderMutations();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data for creating new order
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    deskId: 'none',
    branchId: '',
    notes: '',
    items: [] as { menuItemId: string; quantity: number; notes?: string }[]
  });

  const [newOrderItem, setNewOrderItem] = useState({
    menuItemId: '',
    quantity: 1,
    notes: ''
  });

  // Filter orders based on search, branch, and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = selectedBranch === 'all' || order.branchId === selectedBranch;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Get status configuration
  const getStatusConfig = (status: string) => {
    return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
  };

  // Order CRUD handlers
  const handleCreateOrder = async () => {
    if (!orderForm.branchId || orderForm.items.length === 0) {
      toast.error('Please select a branch and add at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder({
        customerName: orderForm.customerName || undefined,
        customerPhone: orderForm.customerPhone || undefined,
        deskId: orderForm.deskId === "none" || !orderForm.deskId ? undefined : orderForm.deskId,
        branchId: orderForm.branchId,
        notes: orderForm.notes || undefined,
        items: orderForm.items
      });
      
      toast.success('Order created successfully');
      setOrderForm({
        customerName: '',
        customerPhone: '',
        deskId: 'none',
        branchId: '',
        notes: '',
        items: []
      });
      setIsCreateOrderOpen(false);
      refetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus.toLowerCase()}`);
      refetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      refetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const addItemToOrder = () => {
    if (!newOrderItem.menuItemId || newOrderItem.quantity <= 0) {
      toast.error('Please select a menu item and valid quantity');
      return;
    }

    const existingItemIndex = orderForm.items.findIndex(item => item.menuItemId === newOrderItem.menuItemId);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderForm.items];
      updatedItems[existingItemIndex].quantity += newOrderItem.quantity;
      setOrderForm(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      setOrderForm(prev => ({
        ...prev,
        items: [...prev.items, { ...newOrderItem }]
      }));
    }

    // Reset form
    setNewOrderItem({ menuItemId: '', quantity: 1, notes: '' });
  };

  const removeItemFromOrder = (index: number) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateOrderTotal = () => {
    return orderForm.items.reduce((total, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  const handleRefresh = () => {
    refetchOrders();
    toast.success('Orders refreshed');
  };

  const isLoading = ordersLoading;
  const hasError = ordersError;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            Manage restaurant orders and track their status
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>
                  Create a new order for the restaurant.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Customer Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input
                      id="customer-name"
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter customer name (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-phone">Customer Phone</Label>
                    <Input
                      id="customer-phone"
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="Enter phone number (optional)"
                    />
                  </div>
                </div>

                {/* Branch and Desk Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branch">Branch *</Label>
                    <Select value={orderForm.branchId} onValueChange={(value) => setOrderForm(prev => ({ ...prev, branchId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="desk">Table/Desk</Label>
                    <Select value={orderForm.deskId} onValueChange={(value) => setOrderForm(prev => ({ ...prev, deskId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select table (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No table</SelectItem>
                        {desks?.filter(desk => !orderForm.branchId || desk.branchId === orderForm.branchId).map((desk) => (
                          <SelectItem key={desk.id} value={desk.id}>
                            Table {desk.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <Label htmlFor="order-notes">Order Notes</Label>
                  <Textarea
                    id="order-notes"
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter order notes (optional)"
                    rows={2}
                  />
                </div>

                {/* Add Menu Items */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold">Add Menu Items</h4>
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-6">
                      <Label>Menu Item</Label>
                      <Select value={newOrderItem.menuItemId} onValueChange={(value) => setNewOrderItem(prev => ({ ...prev, menuItemId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select menu item" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuItems?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} - {formatCurrency(item.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={newOrderItem.quantity}
                        onChange={(e) => setNewOrderItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Notes</Label>
                      <Input
                        value={newOrderItem.notes}
                        onChange={(e) => setNewOrderItem(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Item notes"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button onClick={addItemToOrder} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Order Items List */}
                  {orderForm.items.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium">Order Items:</h5>
                      {orderForm.items.map((item, index) => {
                        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                        return (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{menuItem?.name}</span>
                              <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                              {item.notes && <span className="text-sm text-gray-500 ml-2">({item.notes})</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{formatCurrency((menuItem?.price || 0) * item.quantity)}</span>
                              <Button variant="ghost" size="sm" onClick={() => removeItemFromOrder(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="text-right font-bold text-lg">
                        Total: {formatCurrency(calculateOrderTotal())}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateOrderOpen(false);
                  setOrderForm({
                    customerName: '',
                    customerPhone: '',
                    deskId: 'none',
                    branchId: '',
                    notes: '',
                    items: []
                  });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrder} disabled={isSubmitting || !orderForm.branchId || orderForm.items.length === 0}>
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Display */}
      {hasError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Error loading orders: {ordersError?.message}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches?.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="hidden md:table-cell">Table</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedBranch !== 'all' || selectedStatus !== 'all'
                        ? 'No orders found matching your criteria'
                        : 'No orders found. Create your first order to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          {order.customerName || 'Walk-in Customer'}
                          {order.customerPhone && (
                            <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.desk ? `Table ${order.desk.number}` : 'No table'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {formatDateTime(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsViewOrderOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                              <Select onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}>
                                <SelectTrigger className="w-[100px] h-8">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUSES.filter(s => s.value !== order.status && s.value !== 'CANCELLED').map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View complete order information and items.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Header */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
                  <div className="font-medium">{selectedOrder.orderNumber}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>
                    <Badge className={getStatusConfig(selectedOrder.status).color}>
                      {getStatusConfig(selectedOrder.status).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Customer</Label>
                  <div>{selectedOrder.customerName || 'Walk-in Customer'}</div>
                  {selectedOrder.customerPhone && (
                    <div className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</div>
                  )}
                </div>
                <div>
                  <Label>Table</Label>
                  <div>{selectedOrder.desk ? `Table ${selectedOrder.desk.number}` : 'No table assigned'}</div>
                </div>
                <div>
                  <Label>Created</Label>
                  <div>{formatDateTime(selectedOrder.createdAt)}</div>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <div className="font-bold text-lg">{formatCurrency(selectedOrder.totalAmount)}</div>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div>
                  <Label>Order Notes</Label>
                  <div className="p-2 bg-gray-50 rounded">{selectedOrder.notes}</div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <Label>Order Items</Label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{item.menuItem?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </div>
                        {item.notes && (
                          <div className="text-sm text-muted-foreground">Notes: {item.notes}</div>
                        )}
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOrderOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
