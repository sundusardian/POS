import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PurchaseOrder } from '@/lib/api-client';

interface DeletePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  purchaseOrder: PurchaseOrder | null;
}

export const DeletePurchaseOrderDialog: React.FC<DeletePurchaseOrderDialogProps> = ({
  open,
  onOpenChange,
  onDelete,
  purchaseOrder
}) => {
  if (!purchaseOrder) {
    return null;
  }

  const isPending = purchaseOrder.status === 'PENDING';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
          <AlertDialogDescription>
            {isPending ? (
              <>
                Are you sure you want to delete this purchase order? This action cannot be undone.
              </>
            ) : (
              <>
                <span className="text-red-500 font-medium">This purchase order cannot be deleted.</span>
                <br />
                Only purchase orders with "Pending" status can be deleted.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isPending && (
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
