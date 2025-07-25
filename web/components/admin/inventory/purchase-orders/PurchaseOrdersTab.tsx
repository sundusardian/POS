import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PurchaseOrderTable } from './PurchaseOrderTable';
import { AddPurchaseOrderDialog } from './AddPurchaseOrderDialog';
import { ViewPurchaseOrderDialog } from './ViewPurchaseOrderDialog';
import { EditPurchaseOrderDialog } from './EditPurchaseOrderDialog';
import { DeletePurchaseOrderDialog } from './DeletePurchaseOrderDialog';
import { usePurchaseOrders, usePurchaseOrderMutations } from '@/lib/hooks';
import { toast } from 'sonner';
import { PurchaseOrder, PurchaseOrderStatus, CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '@/lib/api-client';

export interface PurchaseOrderFormState {
  id?: string;
  supplierId: string;
  branchId: string;
  expectedDeliveryDate?: string;
  notes: string;
  items: {
    id?: string;
    ingredientId: string;
    quantity: number;
    unitPrice: number;
    notes: string;
  }[];
}

export const PurchaseOrdersTab: React.FC<{
  suppliers: any[];
  branches: any[];
  ingredients: any[];
  getSupplierName: (id: string) => string;
  getBranchName: (id: string) => string;
  getIngredientName: (id: string) => string;
}> = ({ 
  suppliers, 
  branches, 
  ingredients,
  getSupplierName,
  getBranchName,
  getIngredientName
}) => {
  // State for purchase orders
  const { purchaseOrders, isLoading: isLoadingPurchaseOrders, error: purchaseOrdersError, refetch: refetchPurchaseOrders } = usePurchaseOrders();
  const { createPurchaseOrder, updatePurchaseOrder, updatePurchaseOrderStatus, deletePurchaseOrder } = usePurchaseOrderMutations();
  
  // State for purchase order dialogs
  const [addPurchaseOrderOpen, setAddPurchaseOrderOpen] = useState(false);
  const [viewPurchaseOrderOpen, setViewPurchaseOrderOpen] = useState(false);
  const [editPurchaseOrderOpen, setEditPurchaseOrderOpen] = useState(false);
  const [deletePurchaseOrderOpen, setDeletePurchaseOrderOpen] = useState(false);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState<string | null>(null);
  
  // State for purchase order filtering
  const [purchaseOrderSearch, setPurchaseOrderSearch] = useState('');
  const [purchaseOrderStatusFilter, setPurchaseOrderStatusFilter] = useState<string>('none');
  
  // State for purchase order form
  const [purchaseOrderForm, setPurchaseOrderForm] = useState<PurchaseOrderFormState>({
    supplierId: '',
    branchId: '',
    expectedDeliveryDate: undefined,
    notes: '',
    items: []
  });

  // Handler for viewing purchase order
  const handleViewPurchaseOrder = (id: string) => {
    setSelectedPurchaseOrderId(id);
    setViewPurchaseOrderOpen(true);
  };

  // Handler for opening edit purchase order form
  const handleOpenEditPurchaseOrder = (id: string) => {
    // Find the order by ID
    const order = purchaseOrders?.find(po => po.id === id);
    
    if (!order) {
      toast.error("Purchase order not found");
      return;
    }
    
    // Set the form state with the order data
    setPurchaseOrderForm({
      id: order.id,
      supplierId: order.supplierId,
      branchId: order.branchId,
      expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0] : undefined,
      notes: order.notes || '',
      items: order.items.map(item => ({
        id: item.id,
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes || ''
      }))
    });
    setSelectedPurchaseOrderId(id);
    setEditPurchaseOrderOpen(true);
  };

  // Handler for updating purchase order
  const handleUpdatePurchaseOrder = async () => {
    if (!purchaseOrderForm.id || !purchaseOrderForm.supplierId || !purchaseOrderForm.branchId || purchaseOrderForm.items.length === 0) {
      toast.error("Please fill all required fields and add at least one item");
      return;
    }

    try {
      const updateDto: UpdatePurchaseOrderDto = {
        supplierId: purchaseOrderForm.supplierId,
        branchId: purchaseOrderForm.branchId,
        expectedDeliveryDate: purchaseOrderForm.expectedDeliveryDate ? new Date(purchaseOrderForm.expectedDeliveryDate) : undefined,
        notes: purchaseOrderForm.notes,
        items: purchaseOrderForm.items.map(item => ({
          id: item.id,
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes
        }))
      };

      await updatePurchaseOrder(purchaseOrderForm.id, updateDto);
      toast.success("Purchase order updated successfully");
      setEditPurchaseOrderOpen(false);
      refetchPurchaseOrders();
    } catch (error) {
      console.error("Error updating purchase order:", error);
      toast.error("Failed to update purchase order");
    }
  };

  // Handler for opening delete purchase order dialog
  const handleOpenDeletePurchaseOrder = (id: string) => {
    setSelectedPurchaseOrderId(id);
    setDeletePurchaseOrderOpen(true);
  };

  // Handler for deleting purchase order
  const handleDeletePurchaseOrder = async () => {
    if (!selectedPurchaseOrderId) return;

    try {
      await deletePurchaseOrder(selectedPurchaseOrderId);
      toast.success("Purchase order deleted successfully");
      setDeletePurchaseOrderOpen(false);
      refetchPurchaseOrders();
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      toast.error("Failed to delete purchase order");
    }
  };

  // Handler for creating purchase order
  const handleCreatePurchaseOrder = async () => {
    if (!purchaseOrderForm.supplierId || !purchaseOrderForm.branchId || purchaseOrderForm.items.length === 0) {
      toast.error("Please fill all required fields and add at least one item");
      return;
    }

    try {
      const createDto: CreatePurchaseOrderDto = {
        supplierId: purchaseOrderForm.supplierId,
        branchId: purchaseOrderForm.branchId,
        expectedDeliveryDate: purchaseOrderForm.expectedDeliveryDate ? new Date(purchaseOrderForm.expectedDeliveryDate) : undefined,
        notes: purchaseOrderForm.notes,
        items: purchaseOrderForm.items.map(item => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes
        }))
      };

      await createPurchaseOrder(createDto);
      toast.success("Purchase order created successfully");
      setAddPurchaseOrderOpen(false);
      // Reset form
      setPurchaseOrderForm({
        supplierId: '',
        branchId: '',
        expectedDeliveryDate: undefined,
        notes: '',
        items: []
      });
      refetchPurchaseOrders();
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Failed to create purchase order");
    }
  };

  // Handler for updating purchase order status
  const handleUpdatePurchaseOrderStatus = async (id: string, status: PurchaseOrderStatus) => {
    try {
      await updatePurchaseOrderStatus(id, status);
      toast.success(`Purchase order marked as ${status.toLowerCase()}`);
      refetchPurchaseOrders();
    } catch (error) {
      console.error("Error updating purchase order status:", error);
      toast.error("Failed to update purchase order status");
    }
  };

  // Filter purchase orders based on search and status filter
  const filteredPurchaseOrders = purchaseOrders?.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(purchaseOrderSearch.toLowerCase()) ||
      getSupplierName(order.supplierId).toLowerCase().includes(purchaseOrderSearch.toLowerCase()) ||
      getBranchName(order.branchId).toLowerCase().includes(purchaseOrderSearch.toLowerCase());
    
    const matchesStatus = !purchaseOrderStatusFilter || purchaseOrderStatusFilter === 'none' || order.status === purchaseOrderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get the selected purchase order
  const selectedPurchaseOrder = selectedPurchaseOrderId 
    ? purchaseOrders?.find(order => order.id === selectedPurchaseOrderId) 
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search purchase orders..."
            value={purchaseOrderSearch}
            onChange={(e) => setPurchaseOrderSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={purchaseOrderStatusFilter}
            onValueChange={setPurchaseOrderStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchPurchaseOrders()}
            disabled={isLoadingPurchaseOrders}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingPurchaseOrders ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Button onClick={() => setAddPurchaseOrderOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Purchase Order
        </Button>
      </div>

      <PurchaseOrderTable
        purchaseOrders={filteredPurchaseOrders || []}
        isLoading={isLoadingPurchaseOrders}
        error={purchaseOrdersError}
        onView={handleViewPurchaseOrder}
        onEdit={handleOpenEditPurchaseOrder}
        onDelete={handleOpenDeletePurchaseOrder}
        onUpdateStatus={handleUpdatePurchaseOrderStatus}
        getSupplierName={getSupplierName}
        getBranchName={getBranchName}
      />

      <AddPurchaseOrderDialog
        open={addPurchaseOrderOpen}
        onOpenChange={setAddPurchaseOrderOpen}
        form={purchaseOrderForm}
        setForm={setPurchaseOrderForm}
        onSubmit={handleCreatePurchaseOrder}
        suppliers={suppliers}
        branches={branches}
        ingredients={ingredients}
        getSupplierName={getSupplierName}
        getBranchName={getBranchName}
        getIngredientName={getIngredientName}
      />

      <ViewPurchaseOrderDialog
        open={viewPurchaseOrderOpen}
        onOpenChange={setViewPurchaseOrderOpen}
        purchaseOrder={selectedPurchaseOrder}
        onUpdateStatus={handleUpdatePurchaseOrderStatus}
        getSupplierName={getSupplierName}
        getBranchName={getBranchName}
        getIngredientName={getIngredientName}
      />

      <EditPurchaseOrderDialog
        open={editPurchaseOrderOpen}
        onOpenChange={setEditPurchaseOrderOpen}
        form={purchaseOrderForm}
        setForm={setPurchaseOrderForm}
        onSubmit={handleUpdatePurchaseOrder}
        suppliers={suppliers}
        branches={branches}
        ingredients={ingredients}
        getSupplierName={getSupplierName}
        getBranchName={getBranchName}
        getIngredientName={getIngredientName}
      />

      <DeletePurchaseOrderDialog
        open={deletePurchaseOrderOpen}
        onOpenChange={setDeletePurchaseOrderOpen}
        onDelete={handleDeletePurchaseOrder}
        purchaseOrder={selectedPurchaseOrder}
      />
    </div>
  );
};
