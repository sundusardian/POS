import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PurchaseOrderFormState } from './PurchaseOrdersTab';

interface EditPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: PurchaseOrderFormState;
  setForm: React.Dispatch<React.SetStateAction<PurchaseOrderFormState>>;
  onSubmit: () => void;
  suppliers: any[];
  branches: any[];
  ingredients: any[];
  getSupplierName: (id: string) => string;
  getBranchName: (id: string) => string;
  getIngredientName: (id: string) => string;
}

export const EditPurchaseOrderDialog: React.FC<EditPurchaseOrderDialogProps> = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  suppliers,
  branches,
  ingredients,
  getSupplierName,
  getBranchName,
  getIngredientName
}) => {
  // Handler for adding a new item to the order
  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { ingredientId: '', quantity: 1, unitPrice: 0, notes: '' }]
    }));
  };

  // Handler for removing an item from the order
  const handleRemoveItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Handler for updating an item in the order
  const handleUpdateItem = (index: number, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
  };

  // Calculate total for the order
  const calculateTotal = () => {
    return form.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  // Get ingredients filtered by selected supplier
  const getFilteredIngredients = () => {
    if (!form.supplierId) return ingredients;
    return ingredients.filter(ingredient => {
      // This is a placeholder - in a real app, you'd have a way to filter ingredients by supplier
      // For now, we'll return all ingredients
      return true;
    });
  };

  const filteredIngredients = getFilteredIngredients();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Supplier *</label>
              <Select
                value={form.supplierId}
                onValueChange={(value) => setForm(prev => ({ ...prev, supplierId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Branch *</label>
              <Select
                value={form.branchId}
                onValueChange={(value) => setForm(prev => ({ ...prev, branchId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Expected Delivery Date</label>
              <Input
                type="date"
                value={form.expectedDeliveryDate || ''}
                onChange={(e) => setForm(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this order..."
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Order Items *</h4>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddItem}
              disabled={!form.supplierId}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>

          {form.items.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500 border rounded-md">
              {form.supplierId ? 'Click "Add Item" to add ingredients to this order' : 'Select a supplier first to add items'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={item.ingredientId}
                        onValueChange={(value) => handleUpdateItem(index, 'ingredientId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ingredient" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredIngredients.map(ingredient => (
                            <SelectItem key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-28"
                      />
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                  <TableCell className="font-medium">{formatCurrency(calculateTotal())}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={onSubmit}
            disabled={!form.supplierId || !form.branchId || form.items.length === 0 || form.items.some(item => !item.ingredientId)}
          >
            Update Purchase Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
