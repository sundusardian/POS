import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Search, Trash2 } from "lucide-react";

// Mock data for staff members
const STAFF_MEMBERS = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    role: "Manager",
    branch: "Main Branch",
    status: "active",
    avatar: "/avatars/budi.png",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti@example.com",
    role: "Cashier",
    branch: "Main Branch",
    status: "active",
    avatar: "/avatars/siti.png",
  },
  {
    id: 3,
    name: "Ahmad Wijaya",
    email: "ahmad@example.com",
    role: "Waiter",
    branch: "Main Branch",
    status: "active",
    avatar: "/avatars/ahmad.png",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    role: "Chef",
    branch: "Main Branch",
    status: "active",
    avatar: "/avatars/dewi.png",
  },
  {
    id: 5,
    name: "Eko Prasetyo",
    email: "eko@example.com",
    role: "Waiter",
    branch: "Second Branch",
    status: "inactive",
    avatar: "/avatars/eko.png",
  },
];

// Mock data for branches
const BRANCHES = [
  { id: 1, name: "Main Branch" },
  { id: 2, name: "Second Branch" },
];

// Mock data for roles
const ROLES = [
  { id: 1, name: "Manager" },
  { id: 2, name: "Cashier" },
  { id: 3, name: "Waiter" },
  { id: 4, name: "Chef" },
];

export default function StaffManagement() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s staff members.
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff members..."
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
                    <SelectItem key={branch.id} value={branch.name.toLowerCase()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select defaultValue="all-roles">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-roles">All Roles</SelectItem>
                  {ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.name.toLowerCase()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                      Create a new staff member for your restaurant.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.name}
                              >
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <Input id="avatar" type="file" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Staff</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STAFF_MEMBERS.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{staff.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell className="hidden md:table-cell">{staff.email}</TableCell>
                  <TableCell>{staff.branch}</TableCell>
                  <TableCell>
                    <Badge
                      variant={staff.status === "active" ? "default" : "secondary"}
                    >
                      {staff.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
