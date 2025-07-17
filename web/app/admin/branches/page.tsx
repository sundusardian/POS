import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, MapPin, Phone, Plus, Search, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for branches
const BRANCHES = [
  {
    id: 1,
    name: "Main Branch",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    phone: "+62 21 5551234",
    manager: "Budi Santoso",
    staffCount: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Second Branch",
    address: "Jl. Gatot Subroto No. 456, Jakarta Selatan",
    phone: "+62 21 5555678",
    manager: "Dewi Lestari",
    staffCount: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Mall Branch",
    address: "Mall Kelapa Gading Lt. 3, Jakarta Utara",
    phone: "+62 21 5559012",
    manager: "Ahmad Wijaya",
    staffCount: 10,
    status: "active",
  },
  {
    id: 4,
    name: "Bandung Branch",
    address: "Jl. Asia Afrika No. 789, Bandung",
    phone: "+62 22 4441234",
    manager: "Siti Rahayu",
    staffCount: 6,
    status: "inactive",
  },
];

export default function BranchManagement() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant's branches.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Branch List</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search branches..."
                    className="pl-8"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" /> Add Branch
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add New Branch</DialogTitle>
                      <DialogDescription>
                        Create a new branch for your restaurant.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Branch Name</Label>
                        <Input id="name" placeholder="Enter branch name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter branch address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Enter phone number" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="manager">Branch Manager</Label>
                        <Input id="manager" placeholder="Enter branch manager name" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input id="latitude" placeholder="Enter latitude" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input id="longitude" placeholder="Enter longitude" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Branch</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {BRANCHES.map((branch) => (
              <Card key={branch.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{branch.name}</CardTitle>
                    <Badge
                      variant={branch.status === "active" ? "default" : "secondary"}
                    >
                      {branch.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>Manager: {branch.manager}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-muted-foreground">
                        {branch.staffCount} Staff Members
                      </span>
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
        
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="h-[500px] w-full rounded-md border">
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  Branch locations map will be displayed here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
