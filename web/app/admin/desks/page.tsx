'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, QrCode, Search, Trash2, RefreshCw, AlertCircle, Users, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useDesks, useBranches, useDeskMutations } from '@/lib/hooks';
import { Desk, CreateDeskDto, UpdateDeskDto } from '@/lib/api-client';

// Desk status configuration
const DESK_STATUSES = [
  { value: 'available', label: 'Available', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'occupied', label: 'Occupied', icon: Users, color: 'bg-red-100 text-red-800' },
  { value: 'reserved', label: 'Reserved', icon: Users, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'maintenance', label: 'Maintenance', icon: XCircle, color: 'bg-gray-100 text-gray-800' },
];

// Get desk status from current orders (this would be enhanced with real-time data)
const getDeskStatus = (desk: Desk) => {
  // For now, determine status based on isActive
  if (!desk.isActive) return 'maintenance';
  // In a real implementation, this would check current orders
  return 'available';
};

// Get status configuration
const getStatusConfig = (status: string) => {
  return DESK_STATUSES.find(s => s.value === status) || DESK_STATUSES[0];
};

export default function DeskManagement() {
  // Data fetching
  const { branches } = useBranches();
  const { desks, isLoading: desksLoading, error: desksError, refetch: refetchDesks } = useDesks();
  const { createDesk, updateDesk, deleteDesk, regenerateQR } = useDeskMutations();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDeskOpen, setIsAddDeskOpen] = useState(false);
  const [isEditDeskOpen, setIsEditDeskOpen] = useState(false);
  const [editingDesk, setEditingDesk] = useState<Desk | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [deskForm, setDeskForm] = useState({
    number: '',
    capacity: 4,
    isActive: true,
    branchId: ''
  });

  // Filter desks based on search and filters
  const filteredDesks = desks.filter(desk => {
    const matchesSearch = desk.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || desk.branchId === selectedBranch;
    const deskStatus = getDeskStatus(desk);
    const matchesStatus = selectedStatus === 'all' || deskStatus === selectedStatus;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Desk CRUD handlers
  const handleAddDesk = async () => {
    if (!deskForm.number.trim() || !deskForm.branchId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDesk({
        number: deskForm.number,
        capacity: deskForm.capacity,
        isActive: deskForm.isActive,
        branchId: deskForm.branchId
      });
      
      toast.success('Desk created successfully');
      setDeskForm({ number: '', capacity: 4, isActive: true, branchId: '' });
      setIsAddDeskOpen(false);
      refetchDesks();
    } catch (error) {
      console.error('Error creating desk:', error);
      toast.error('Failed to create desk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDesk = async () => {
    if (!editingDesk || !deskForm.number.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDesk(editingDesk.id, {
        number: deskForm.number,
        capacity: deskForm.capacity,
        isActive: deskForm.isActive
      });
      
      toast.success('Desk updated successfully');
      setDeskForm({ number: '', capacity: 4, isActive: true, branchId: '' });
      setIsEditDeskOpen(false);
      setEditingDesk(null);
      refetchDesks();
    } catch (error) {
      console.error('Error updating desk:', error);
      toast.error('Failed to update desk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDesk = async (desk: Desk) => {
    if (!confirm(`Are you sure you want to delete Table ${desk.number}?`)) return;

    try {
      await deleteDesk(desk.id);
      toast.success('Desk deleted successfully');
      refetchDesks();
    } catch (error) {
      console.error('Error deleting desk:', error);
      toast.error('Failed to delete desk');
    }
  };

  const openEditDesk = (desk: Desk) => {
    setEditingDesk(desk);
    setDeskForm({
      number: desk.number,
      capacity: desk.capacity,
      isActive: desk.isActive,
      branchId: desk.branchId
    });
    setIsEditDeskOpen(true);
  };

  const handleRegenerateQR = async (desk: Desk) => {
    try {
      await regenerateQR(desk.id);
      toast.success('QR code regenerated successfully');
      refetchDesks();
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      toast.error('Failed to regenerate QR code');
    }
  };

  const handleRefresh = () => {
    refetchDesks();
    toast.success('Desks refreshed');
  };

  const isLoading = desksLoading;
  const hasError = desksError;

  // Statistics
  const totalDesks = desks.length;
  const availableDesks = desks.filter(desk => getDeskStatus(desk) === 'available').length;
  const occupiedDesks = desks.filter(desk => getDeskStatus(desk) === 'occupied').length;
  const maintenanceDesks = desks.filter(desk => !desk.isActive).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Desk Management</h1>
          <p className="text-muted-foreground">
            Manage restaurant tables and seating arrangements
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDeskOpen} onOpenChange={setIsAddDeskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Desk
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Desk</DialogTitle>
                <DialogDescription>
                  Create a new table/desk for your restaurant.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="desk-number">Table Number *</Label>
                  <Input
                    id="desk-number"
                    value={deskForm.number}
                    onChange={(e) => setDeskForm(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="Enter table number (e.g., 1, A1, VIP-1)"
                  />
                </div>
                <div>
                  <Label htmlFor="desk-capacity">Capacity *</Label>
                  <Input
                    id="desk-capacity"
                    type="number"
                    min="1"
                    max="20"
                    value={deskForm.capacity}
                    onChange={(e) => setDeskForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    placeholder="Enter seating capacity"
                  />
                </div>
                <div>
                  <Label htmlFor="desk-branch">Branch *</Label>
                  <Select value={deskForm.branchId} onValueChange={(value) => setDeskForm(prev => ({ ...prev, branchId: value }))}>
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="desk-active"
                    checked={deskForm.isActive}
                    onCheckedChange={(checked) => setDeskForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="desk-active">Active (available for use)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddDeskOpen(false);
                  setDeskForm({ number: '', capacity: 4, isActive: true, branchId: '' });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddDesk} disabled={isSubmitting || !deskForm.number.trim() || !deskForm.branchId}>
                  {isSubmitting ? 'Creating...' : 'Add Desk'}
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
              <span>Error loading desks: {desksError?.message}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Desks</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDesks}</div>
            <p className="text-xs text-muted-foreground">
              All tables in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableDesks}</div>
            <p className="text-xs text-muted-foreground">
              Ready for customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedDesks}</div>
            <p className="text-xs text-muted-foreground">
              Currently in use
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{maintenanceDesks}</div>
            <p className="text-xs text-muted-foreground">
              Out of service
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tables..."
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
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {DESK_STATUSES.map((status) => (
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

      {/* Desks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tables ({filteredDesks.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading tables...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table #</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">QR Code</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDesks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedBranch !== 'all' || selectedStatus !== 'all'
                        ? 'No tables found matching your criteria'
                        : 'No tables found. Create your first table to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDesks.map((desk) => {
                    const status = getDeskStatus(desk);
                    const statusConfig = getStatusConfig(status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <TableRow key={desk.id}>
                        <TableCell className="font-medium">Table {desk.number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {desk.capacity}
                          </div>
                        </TableCell>
                        <TableCell>{desk.branch?.name || 'Unknown Branch'}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {desk.qrCode ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerateQR(desk)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRegenerateQR(desk)}
                            >
                              Generate QR
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDesk(desk)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDesk(desk)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* Edit Desk Dialog */}
      <Dialog open={isEditDeskOpen} onOpenChange={setIsEditDeskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Desk</DialogTitle>
            <DialogDescription>
              Update the table/desk information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-desk-number">Table Number *</Label>
              <Input
                id="edit-desk-number"
                value={deskForm.number}
                onChange={(e) => setDeskForm(prev => ({ ...prev, number: e.target.value }))}
                placeholder="Enter table number"
              />
            </div>
            <div>
              <Label htmlFor="edit-desk-capacity">Capacity *</Label>
              <Input
                id="edit-desk-capacity"
                type="number"
                min="1"
                max="20"
                value={deskForm.capacity}
                onChange={(e) => setDeskForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                placeholder="Enter seating capacity"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-desk-active"
                checked={deskForm.isActive}
                onCheckedChange={(checked) => setDeskForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-desk-active">Active (available for use)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDeskOpen(false);
              setEditingDesk(null);
              setDeskForm({ number: '', capacity: 4, isActive: true, branchId: '' });
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditDesk} disabled={isSubmitting || !deskForm.number.trim()}>
              {isSubmitting ? 'Updating...' : 'Update Desk'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
