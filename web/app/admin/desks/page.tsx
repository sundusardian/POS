import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Printer, QrCode, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for desks/tables
const DESKS = [
  {
    id: 1,
    name: "Table 1",
    capacity: 4,
    location: "Indoor",
    branch: "Main Branch",
    status: "available",
    qrCode: "https://example.com/qr/table1",
  },
  {
    id: 2,
    name: "Table 2",
    capacity: 2,
    location: "Indoor",
    branch: "Main Branch",
    status: "occupied",
    qrCode: "https://example.com/qr/table2",
  },
  {
    id: 3,
    name: "Table 3",
    capacity: 6,
    location: "Outdoor",
    branch: "Main Branch",
    status: "available",
    qrCode: "https://example.com/qr/table3",
  },
  {
    id: 4,
    name: "Table 4",
    capacity: 4,
    location: "Indoor",
    branch: "Main Branch",
    status: "reserved",
    qrCode: "https://example.com/qr/table4",
  },
  {
    id: 5,
    name: "Table 5",
    capacity: 8,
    location: "Outdoor",
    branch: "Main Branch",
    status: "available",
    qrCode: "https://example.com/qr/table5",
  },
  {
    id: 6,
    name: "Table 1",
    capacity: 4,
    location: "Indoor",
    branch: "Second Branch",
    status: "available",
    qrCode: "https://example.com/qr/sb-table1",
  },
  {
    id: 7,
    name: "Table 2",
    capacity: 2,
    location: "Indoor",
    branch: "Second Branch",
    status: "occupied",
    qrCode: "https://example.com/qr/sb-table2",
  },
  {
    id: 8,
    name: "VIP Room",
    capacity: 12,
    location: "Private",
    branch: "Main Branch",
    status: "available",
    qrCode: "https://example.com/qr/vip-room",
  },
];

// Mock data for branches
const BRANCHES = [
  { id: 1, name: "Main Branch" },
  { id: 2, name: "Second Branch" },
  { id: 3, name: "Mall Branch" },
  { id: 4, name: "Bandung Branch" },
];

// Function to get status badge variant
const getStatusVariant = (status: string) => {
  switch (status) {
    case "available":
      return "success";
    case "occupied":
      return "destructive";
    case "reserved":
      return "warning";
    default:
      return "secondary";
  }
};

export default function DeskManagement() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Desk Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant's tables and desks.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="layout">Layout View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search desks..."
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all-branches">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-branches">All Branches</SelectItem>
                      {BRANCHES.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name.toLowerCase().replace(" ", "-")}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all-statuses">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-statuses">All Statuses</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-1">
                        <Plus className="h-4 w-4" /> Add Desk
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Add New Desk</DialogTitle>
                        <DialogDescription>
                          Create a new desk or table for your restaurant.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Desk/Table Name</Label>
                          <Input id="name" placeholder="Enter desk name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                              id="capacity"
                              type="number"
                              placeholder="0"
                              min="1"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="branch">Branch</Label>
                            <Select>
                              <SelectTrigger id="branch">
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                              <SelectContent>
                                {BRANCHES.map((branch) => (
                                  <SelectItem
                                    key={branch.id}
                                    value={branch.name}
                                  >
                                    {branch.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location">Location</Label>
                          <Select>
                            <SelectTrigger id="location">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Indoor">Indoor</SelectItem>
                              <SelectItem value="Outdoor">Outdoor</SelectItem>
                              <SelectItem value="Private">Private Room</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Desk</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DESKS.map((desk) => (
              <Card key={desk.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{desk.name}</CardTitle>
                    <Badge
                      variant={desk.status === "available" ? "default" : 
                              desk.status === "occupied" ? "destructive" : "outline"}
                    >
                      {desk.status.charAt(0).toUpperCase() + desk.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{desk.branch}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{desk.capacity} people</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{desk.location}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="gap-1">
                          <QrCode className="h-4 w-4" />
                          <span>View QR</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Printer className="h-4 w-4" />
                          <span>Print</span>
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Restaurant Layout</CardTitle>
                <Select defaultValue="main-branch">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem 
                        key={branch.id} 
                        value={branch.name.toLowerCase().replace(" ", "-")}
                      >
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Drag and drop tables to arrange your restaurant layout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] w-full rounded-md border">
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  Interactive restaurant layout will be displayed here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* QR Code Dialog */}
      <Dialog>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Table QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to access the menu for this table.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="h-64 w-64 rounded-md border">
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                QR Code Image
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              This QR code links directly to the customer menu page for Table 1.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline">Download</Button>
            <Button>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
