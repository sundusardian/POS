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
import { Edit, Plus, Search, Trash2, RefreshCw, AlertCircle, Tag } from "lucide-react";
import { toast } from 'sonner';
import { useCategories, useMenuItems } from '@/lib/hooks';
import apiClient, { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '@/lib/api-client';
import Link from 'next/link';

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function MenuManagement() {
  // Data fetching
  const { categories } = useCategories();
  const { menuItems, isLoading: menuItemsLoading, error: menuItemsError, refetch: refetchMenuItems } = useMenuItems();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    imageUrl: ''
  });

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Menu item CRUD handlers
  const handleAddMenuItem = async () => {
    if (!menuItemForm.name.trim() || !menuItemForm.categoryId || menuItemForm.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createMenuItem({
        name: menuItemForm.name,
        description: menuItemForm.description || undefined,
        price: menuItemForm.price,
        categoryId: menuItemForm.categoryId,
        imageUrl: menuItemForm.imageUrl || undefined
      });
      
      toast.success('Menu item created successfully');
      setMenuItemForm({ name: '', description: '', price: 0, categoryId: '', imageUrl: '' });
      setIsAddMenuItemOpen(false);
      refetchMenuItems();
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast.error('Failed to create menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMenuItem = async () => {
    if (!editingMenuItem || !menuItemForm.name.trim() || !menuItemForm.categoryId || menuItemForm.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.updateMenuItem(editingMenuItem.id, {
        name: menuItemForm.name,
        description: menuItemForm.description || undefined,
        price: menuItemForm.price,
        categoryId: menuItemForm.categoryId,
        imageUrl: menuItemForm.imageUrl || undefined
      });
      
      toast.success('Menu item updated successfully');
      setMenuItemForm({ name: '', description: '', price: 0, categoryId: '', imageUrl: '' });
      setIsEditMenuItemOpen(false);
      setEditingMenuItem(null);
      refetchMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (menuItem: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${menuItem.name}"?`)) return;

    try {
      await apiClient.deleteMenuItem(menuItem.id);
      toast.success('Menu item deleted successfully');
      refetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const openEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setMenuItemForm({
      name: menuItem.name,
      description: menuItem.description || '',
      price: menuItem.price,
      categoryId: menuItem.categoryId,
      imageUrl: menuItem.imageUrl || ''
    });
    setIsEditMenuItemOpen(true);
  };

  const handleRefresh = () => {
    refetchMenuItems();
    toast.success('Menu items refreshed');
  };

  const isLoading = menuItemsLoading;
  const hasError = menuItemsError;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s menu items
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/menu/categories">
            <Button variant="outline" size="sm">
              <Tag className="mr-2 h-4 w-4" />
              Manage Categories
            </Button>
          </Link>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddMenuItemOpen} onOpenChange={setIsAddMenuItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Create a new menu item for your restaurant.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item-name">Name *</Label>
                  <Input
                    id="item-name"
                    value={menuItemForm.name}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={menuItemForm.description}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter item description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="item-price">Price (IDR) *</Label>
                  <Input
                    id="item-price"
                    type="number"
                    min="0"
                    value={menuItemForm.price || ''}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <Label htmlFor="item-category">Category *</Label>
                  <Select value={menuItemForm.categoryId} onValueChange={(value) => setMenuItemForm(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="item-image">Image URL</Label>
                  <Input
                    id="item-image"
                    value={menuItemForm.imageUrl}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Enter image URL (optional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddMenuItemOpen(false);
                  setMenuItemForm({ name: '', description: '', price: 0, categoryId: '', imageUrl: '' });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddMenuItem} disabled={isSubmitting || !menuItemForm.name.trim() || !menuItemForm.categoryId || menuItemForm.price <= 0}>
                  {isSubmitting ? 'Creating...' : 'Create Item'}
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
              <span>Error loading menu items: {menuItemsError?.message}</span>
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
                placeholder="Search menu items..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Items ({filteredMenuItems.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading menu items...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenuItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'No menu items found matching your criteria' 
                        : 'No menu items found. Create your first menu item to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMenuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.category?.name || 'No Category'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {item.description || 'No description'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditMenuItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditMenuItemOpen} onOpenChange={setIsEditMenuItemOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the menu item information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-item-name">Name *</Label>
              <Input
                id="edit-item-name"
                value={menuItemForm.name}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="edit-item-description">Description</Label>
              <Textarea
                id="edit-item-description"
                value={menuItemForm.description}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-item-price">Price (IDR) *</Label>
              <Input
                id="edit-item-price"
                type="number"
                min="0"
                value={menuItemForm.price || ''}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label htmlFor="edit-item-category">Category *</Label>
              <Select value={menuItemForm.categoryId} onValueChange={(value) => setMenuItemForm(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-item-image">Image URL</Label>
              <Input
                id="edit-item-image"
                value={menuItemForm.imageUrl}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Enter image URL (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditMenuItemOpen(false);
              setEditingMenuItem(null);
              setMenuItemForm({ name: '', description: '', price: 0, categoryId: '', imageUrl: '' });
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditMenuItem} disabled={isSubmitting || !menuItemForm.name.trim() || !menuItemForm.categoryId || menuItemForm.price <= 0}>
              {isSubmitting ? 'Updating...' : 'Update Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}