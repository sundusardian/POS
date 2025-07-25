import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle, ChevronDown, Edit, Eye, MoreHorizontal, Package, Trash2, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PurchaseOrder, PurchaseOrderStatus } from '@/lib/api-client';

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  error: any;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: PurchaseOrderStatus) => void;
  getSupplierName: (id: string) => string;
  getBranchName: (id: string) => string;
}

export const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  purchaseOrders,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  getSupplierName,
  getBranchName
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500">Failed to load purchase orders</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (purchaseOrders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500">No purchase orders found</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchaseOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{getSupplierName(order.supplierId)}</TableCell>
            <TableCell>{getBranchName(order.branchId)}</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">{formatCurrency(calculateTotal(order))}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(order.id)}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                  
                  {order.status === 'PENDING' && (
                    <DropdownMenuItem onClick={() => onEdit(order.id)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                  )}
                  
                  {/* Status update options */}
                  {order.status === 'PENDING' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'APPROVED')}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </DropdownMenuItem>
                  )}
                  
                  {order.status === 'APPROVED' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'SHIPPED')}>
                      <Package className="mr-2 h-4 w-4" /> Mark as Shipped
                    </DropdownMenuItem>
                  )}
                  
                  {order.status === 'SHIPPED' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'DELIVERED')}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
                    </DropdownMenuItem>
                  )}
                  
                  {(order.status === 'PENDING' || order.status === 'APPROVED') && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'CANCELLED')}>
                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                    </DropdownMenuItem>
                  )}
                  
                  {order.status === 'PENDING' && (
                    <DropdownMenuItem onClick={() => onDelete(order.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
