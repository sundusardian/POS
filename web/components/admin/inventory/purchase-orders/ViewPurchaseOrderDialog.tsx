import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Package, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PurchaseOrder, PurchaseOrderStatus } from '@/lib/api-client';

interface ViewPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder: PurchaseOrder | null;
  onUpdateStatus: (id: string, status: PurchaseOrderStatus) => void;
  getSupplierName: (id: string) => string;
  getBranchName: (id: string) => string;
  getIngredientName: (id: string) => string;
}

export const ViewPurchaseOrderDialog: React.FC<ViewPurchaseOrderDialogProps> = ({
  open,
  onOpenChange,
  purchaseOrder,
  onUpdateStatus,
  getSupplierName,
  getBranchName,
  getIngredientName
}) => {
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="secondary">Approved</Badge>;
      case 'SHIPPED':
        return <Badge variant="default">Shipped</Badge>;
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to calculate total amount
  const calculateTotal = (order: PurchaseOrder) => {
    return order.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  if (!purchaseOrder) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Purchase Order #{purchaseOrder.id}</span>
            {getStatusBadge(purchaseOrder.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Order Details</h4>
            <div className="text-sm">
              <p><span className="font-medium">Created:</span> {new Date(purchaseOrder.createdAt).toLocaleString()}</p>
              <p><span className="font-medium">Supplier:</span> {getSupplierName(purchaseOrder.supplierId)}</p>
              <p><span className="font-medium">Branch:</span> {getBranchName(purchaseOrder.branchId)}</p>
              {purchaseOrder.expectedDeliveryDate && (
                <p><span className="font-medium">Expected Delivery:</span> {new Date(purchaseOrder.expectedDeliveryDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <div className="text-sm border rounded-md p-2 min-h-[60px] bg-muted/50">
              {purchaseOrder.notes || "No notes provided"}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Order Items</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrder.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getIngredientName(item.ingredientId)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(calculateTotal(purchaseOrder))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {/* Status update buttons */}
          {purchaseOrder.status === 'PENDING' && (
            <Button 
              variant="outline" 
              onClick={() => onUpdateStatus(purchaseOrder.id, 'APPROVED')}
              className="flex items-center"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </Button>
          )}
          
          {purchaseOrder.status === 'APPROVED' && (
            <Button 
              variant="outline" 
              onClick={() => onUpdateStatus(purchaseOrder.id, 'SHIPPED')}
              className="flex items-center"
            >
              <Package className="mr-2 h-4 w-4" /> Mark as Shipped
            </Button>
          )}
          
          {purchaseOrder.status === 'SHIPPED' && (
            <Button 
              variant="outline" 
              onClick={() => onUpdateStatus(purchaseOrder.id, 'DELIVERED')}
              className="flex items-center"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
            </Button>
          )}
          
          {(purchaseOrder.status === 'PENDING' || purchaseOrder.status === 'APPROVED') && (
            <Button 
              variant="outline" 
              onClick={() => onUpdateStatus(purchaseOrder.id, 'CANCELLED')}
              className="flex items-center text-red-600"
            >
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
          
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
