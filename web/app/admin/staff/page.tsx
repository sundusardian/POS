"use client"

import {useState} from "react"
import {toast} from "sonner"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import {Switch} from "@/components/ui/switch"
import {
   AlertCircle,
   Edit,
   Plus,
   Search,
   Trash2,
   RefreshCw,
   Users,
   UserCheck,
   UserX,
   Shield,
} from "lucide-react"
import {useStaff, useBranches, useStaffMutations} from "@/lib/hooks"
import {Staff, CreateStaffDto, UpdateStaffDto} from "@/lib/api-client"

// Staff role configuration
const STAFF_ROLES = [
   {
      value: "ADMIN",
      label: "Admin",
      icon: Shield,
      color: "bg-red-100 text-red-800",
   },
   {
      value: "MANAGER",
      label: "Manager",
      icon: UserCheck,
      color: "bg-blue-100 text-blue-800",
   },
   {
      value: "STAFF",
      label: "Staff",
      icon: Users,
      color: "bg-green-100 text-green-800",
   },
]

// Get role configuration
const getRoleConfig = (role: string) => {
   return STAFF_ROLES.find((r) => r.value === role) || STAFF_ROLES[2]
}

// Get initials from name
const getInitials = (name: string) => {
   return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
}

export default function StaffManagement() {
   // Data fetching
   const {branches} = useBranches()
   const {
      staff,
      isLoading: staffLoading,
      error: staffError,
      refetch: refetchStaff,
   } = useStaff()
   const {createStaff, updateStaff, deleteStaff} = useStaffMutations()

   // State management
   const [searchTerm, setSearchTerm] = useState("")
   const [selectedBranch, setSelectedBranch] = useState<string>("all")
   const [selectedRole, setSelectedRole] = useState<string>("all")
   const [selectedStatus, setSelectedStatus] = useState<string>("all")
   const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
   const [isEditStaffOpen, setIsEditStaffOpen] = useState(false)
   const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
   const [isSubmitting, setIsSubmitting] = useState(false)

   // Form data
   const [staffForm, setStaffForm] = useState({
      name: "",
      email: "",
      password: "",
      role: "STAFF" as "ADMIN" | "MANAGER" | "STAFF",
      isActive: true,
      branchId: "none",
   })

   // Filter staff based on search and filters
   const filteredStaff = staff.filter((member) => {
      const matchesSearch =
         member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         member.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBranch =
         selectedBranch === "all" || member.primaryBranchId === selectedBranch
      const matchesRole = selectedRole === "all" || member.role === selectedRole
      const matchesStatus =
         selectedStatus === "all" ||
         (selectedStatus === "active" && member.isActive) ||
         (selectedStatus === "inactive" && !member.isActive)
      return matchesSearch && matchesBranch && matchesRole && matchesStatus
   })

   // Staff CRUD handlers
   const handleAddStaff = async () => {
      if (
         !staffForm.name.trim() ||
         !staffForm.email.trim() ||
         !staffForm.password.trim()
      ) {
         toast.error("Please fill in all required fields")
         return
      }

      setIsSubmitting(true)
      try {
         await createStaff({
            name: staffForm.name,
            email: staffForm.email,
            password: staffForm.password,
            role: staffForm.role,
            isActive: staffForm.isActive,
            primaryBranchId: staffForm.branchId === "none" || !staffForm.branchId ? undefined : staffForm.branchId,
         })

         toast.success("Staff member created successfully")
         setStaffForm({
            name: "",
            email: "",
            password: "",
            role: "STAFF",
            isActive: true,
            branchId: "none",
         })
         setIsAddStaffOpen(false)
         refetchStaff()
      } catch (error) {
         console.error("Error creating staff:", error)
         toast.error("Failed to create staff member")
      } finally {
         setIsSubmitting(false)
      }
   }

   const handleEditStaff = async () => {
      if (!editingStaff || !staffForm.name.trim() || !staffForm.email.trim()) {
         toast.error("Please fill in all required fields")
         return
      }

      setIsSubmitting(true)
      try {
         const updateData: UpdateStaffDto = {
            name: staffForm.name,
            email: staffForm.email,
            role: staffForm.role,
            isActive: staffForm.isActive,
            primaryBranchId: staffForm.branchId === "none" || !staffForm.branchId ? undefined : staffForm.branchId,
         }

         // Only include password if it's provided
         if (staffForm.password.trim()) {
            updateData.password = staffForm.password
         }

         await updateStaff(editingStaff.id, updateData)

         toast.success("Staff member updated successfully")
         setStaffForm({
            name: "",
            email: "",
            password: "",
            role: "STAFF",
            isActive: true,
            branchId: "none",
         })
         setIsEditStaffOpen(false)
         setEditingStaff(null)
         refetchStaff()
      } catch (error) {
         console.error("Error updating staff:", error)
         toast.error("Failed to update staff member")
      } finally {
         setIsSubmitting(false)
      }
   }

   const handleDeleteStaff = async (member: Staff) => {
      if (!confirm(`Are you sure you want to delete ${member.name}?`)) return

      try {
         await deleteStaff(member.id)
         toast.success("Staff member deleted successfully")
         refetchStaff()
      } catch (error) {
         console.error("Error deleting staff:", error)
         toast.error("Failed to delete staff member")
      }
   }

   const openEditStaff = (member: Staff) => {
      setEditingStaff(member)
      setStaffForm({
         name: member.name,
         email: member.email,
         password: "", // Don't pre-fill password for security
         role: member.role,
         isActive: member.isActive,
         branchId: member.primaryBranchId || "",
      })
      setIsEditStaffOpen(true)
   }

   const handleRefresh = () => {
      refetchStaff()
      toast.success("Staff list refreshed")
   }

   const isLoading = staffLoading
   const hasError = staffError

   // Statistics
   const totalStaff = staff.length
   const activeStaff = staff.filter((member) => member.isActive).length
   const inactiveStaff = staff.filter((member) => !member.isActive).length
   const adminCount = staff.filter((member) => member.role === "ADMIN").length
   const managerCount = staff.filter(
      (member) => member.role === "MANAGER"
   ).length

   return (
      <div className="container mx-auto p-6 space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">
                  Staff Management
               </h1>
               <p className="text-muted-foreground">
                  Manage restaurant staff members and their roles
               </p>
            </div>
            <div className="flex gap-2">
               <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
               >
                  <RefreshCw
                     className={`mr-2 h-4 w-4 ${
                        isLoading ? "animate-spin" : ""
                     }`}
                  />
                  Refresh
               </Button>
               <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                  <DialogTrigger asChild>
                     <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Staff
                     </Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>
                           Create a new staff member account with role and
                           branch assignment.
                        </DialogDescription>
                     </DialogHeader>
                     <div className="space-y-4">
                        <div>
                           <Label htmlFor="staff-name">Full Name *</Label>
                           <Input
                              id="staff-name"
                              value={staffForm.name}
                              onChange={(e) =>
                                 setStaffForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                 }))
                              }
                              placeholder="Enter full name"
                           />
                        </div>
                        <div>
                           <Label htmlFor="staff-email">Email Address *</Label>
                           <Input
                              id="staff-email"
                              type="email"
                              value={staffForm.email}
                              onChange={(e) =>
                                 setStaffForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                 }))
                              }
                              placeholder="Enter email address"
                           />
                        </div>
                        <div>
                           <Label htmlFor="staff-password">Password *</Label>
                           <Input
                              id="staff-password"
                              type="password"
                              value={staffForm.password}
                              onChange={(e) =>
                                 setStaffForm((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                 }))
                              }
                              placeholder="Enter password (min 6 characters)"
                           />
                        </div>
                        <div>
                           <Label htmlFor="staff-role">Role *</Label>
                           <Select
                              value={staffForm.role}
                              onValueChange={(
                                 value: "ADMIN" | "MANAGER" | "STAFF"
                              ) =>
                                 setStaffForm((prev) => ({
                                    ...prev,
                                    role: value,
                                 }))
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                 {STAFF_ROLES.map((role) => (
                                    <SelectItem
                                       key={role.value}
                                       value={role.value}
                                    >
                                       {role.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                        <div>
                           <Label htmlFor="staff-branch">
                              Branch (Optional)
                           </Label>
                           <Select
                              value={staffForm.branchId}
                              onValueChange={(value) =>
                                 setStaffForm((prev) => ({
                                    ...prev,
                                    branchId: value,
                                 }))
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="No Branch">
                                    No specific branch
                                 </SelectItem>
                                 {branches?.map((branch) => (
                                    <SelectItem
                                       key={branch.id}
                                       value={branch.id}
                                    >
                                       {branch.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Switch
                              id="staff-active"
                              checked={staffForm.isActive}
                              onCheckedChange={(checked) =>
                                 setStaffForm((prev) => ({
                                    ...prev,
                                    isActive: checked,
                                 }))
                              }
                           />
                           <Label htmlFor="staff-active">
                              Active (can login and work)
                           </Label>
                        </div>
                     </div>
                     <DialogFooter>
                        <Button
                           variant="outline"
                           onClick={() => {
                              setIsAddStaffOpen(false)
                              setStaffForm({
                                 name: "",
                                 email: "",
                                 password: "",
                                 role: "STAFF",
                                 isActive: true,
                                 branchId: "",
                              })
                           }}
                        >
                           Cancel
                        </Button>
                        <Button
                           onClick={handleAddStaff}
                           disabled={
                              isSubmitting ||
                              !staffForm.name.trim() ||
                              !staffForm.email.trim() ||
                              !staffForm.password.trim()
                           }
                        >
                           {isSubmitting ? "Creating..." : "Add Staff"}
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
                     <span>Error loading staff: {staffError?.message}</span>
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Statistics Cards */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Total Staff
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{totalStaff}</div>
                  <p className="text-xs text-muted-foreground">
                     All staff members
                  </p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Active Staff
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                     {activeStaff}
                  </div>
                  <p className="text-xs text-muted-foreground">
                     Currently working
                  </p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Managers
                  </CardTitle>
                  <Shield className="h-4 w-4 text-blue-600" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                     {managerCount + adminCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                     Admin & Manager roles
                  </p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Inactive
                  </CardTitle>
                  <UserX className="h-4 w-4 text-gray-600" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-gray-600">
                     {inactiveStaff}
                  </div>
                  <p className="text-xs text-muted-foreground">
                     Not currently working
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
                        placeholder="Search staff..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <div className="flex gap-2">
                     <Select
                        value={selectedBranch}
                        onValueChange={setSelectedBranch}
                     >
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
                     <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                     >
                        <SelectTrigger className="w-[150px]">
                           <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Roles</SelectItem>
                           {STAFF_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                 {role.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                     >
                        <SelectTrigger className="w-[150px]">
                           <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Status</SelectItem>
                           <SelectItem value="active">Active</SelectItem>
                           <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Staff Table */}
         <Card>
            <CardHeader>
               <CardTitle>Staff Members ({filteredStaff.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                     <RefreshCw className="h-6 w-6 animate-spin" />
                     <span className="ml-2">Loading staff...</span>
                  </div>
               ) : (
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Staff Member</TableHead>
                           <TableHead>Email</TableHead>
                           <TableHead>Role</TableHead>
                           <TableHead>Branch</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredStaff.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={6}
                                 className="text-center py-8 text-muted-foreground"
                              >
                                 {searchTerm ||
                                 selectedBranch !== "all" ||
                                 selectedRole !== "all" ||
                                 selectedStatus !== "all"
                                    ? "No staff found matching your criteria"
                                    : "No staff members found. Create your first staff member to get started."}
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredStaff.map((member) => {
                              const roleConfig = getRoleConfig(member.role)
                              const RoleIcon = roleConfig.icon

                              return (
                                 <TableRow key={member.id}>
                                    <TableCell>
                                       <div className="flex items-center gap-3">
                                          <Avatar className="h-8 w-8">
                                             <AvatarImage
                                                src={`/avatars/${member.name
                                                   .toLowerCase()
                                                   .replace(" ", "-")}.png`}
                                             />
                                             <AvatarFallback>
                                                {getInitials(member.name)}
                                             </AvatarFallback>
                                          </Avatar>
                                          <div>
                                             <div className="font-medium">
                                                {member.name}
                                             </div>
                                             <div className="text-sm text-muted-foreground">
                                                ID: {member.id.slice(0, 8)}
                                             </div>
                                          </div>
                                       </div>
                                    </TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                       <Badge className={roleConfig.color}>
                                          <RoleIcon className="mr-1 h-3 w-3" />
                                          {roleConfig.label}
                                       </Badge>
                                    </TableCell>
                                    <TableCell>
                                       {member.primaryBranch?.name || 'No branch'}
                                    </TableCell>
                                    <TableCell>
                                       <Badge
                                          variant={
                                             member.isActive
                                                ? "default"
                                                : "secondary"
                                          }
                                       >
                                          {member.isActive
                                             ? "Active"
                                             : "Inactive"}
                                       </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <div className="flex justify-end gap-1">
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() =>
                                                openEditStaff(member)
                                             }
                                          >
                                             <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() =>
                                                handleDeleteStaff(member)
                                             }
                                          >
                                             <Trash2 className="h-4 w-4" />
                                          </Button>
                                       </div>
                                    </TableCell>
                                 </TableRow>
                              )
                           })
                        )}
                     </TableBody>
                  </Table>
               )}
            </CardContent>
         </Card>

         {/* Edit Staff Dialog */}
         <Dialog open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Edit Staff Member</DialogTitle>
                  <DialogDescription>
                     Update staff member information and settings.
                  </DialogDescription>
               </DialogHeader>
               <div className="space-y-4">
                  <div>
                     <Label htmlFor="edit-staff-name">Full Name *</Label>
                     <Input
                        id="edit-staff-name"
                        value={staffForm.name}
                        onChange={(e) =>
                           setStaffForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                           }))
                        }
                        placeholder="Enter full name"
                     />
                  </div>
                  <div>
                     <Label htmlFor="edit-staff-email">Email Address *</Label>
                     <Input
                        id="edit-staff-email"
                        type="email"
                        value={staffForm.email}
                        onChange={(e) =>
                           setStaffForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                           }))
                        }
                        placeholder="Enter email address"
                     />
                  </div>
                  <div>
                     <Label htmlFor="edit-staff-password">
                        New Password (Optional)
                     </Label>
                     <Input
                        id="edit-staff-password"
                        type="password"
                        value={staffForm.password}
                        onChange={(e) =>
                           setStaffForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                           }))
                        }
                        placeholder="Leave empty to keep current password"
                     />
                  </div>
                  <div>
                     <Label htmlFor="edit-staff-role">Role *</Label>
                     <Select
                        value={staffForm.role}
                        onValueChange={(value: "ADMIN" | "MANAGER" | "STAFF") =>
                           setStaffForm((prev) => ({...prev, role: value}))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                           {STAFF_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                 {role.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="edit-staff-branch">
                        Branch (Optional)
                     </Label>
                     <Select
                        value={staffForm.branchId}
                        onValueChange={(value) =>
                           setStaffForm((prev) => ({...prev, branchId: value}))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="none">No specific branch</SelectItem>
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
                        id="edit-staff-active"
                        checked={staffForm.isActive}
                        onCheckedChange={(checked) =>
                           setStaffForm((prev) => ({
                              ...prev,
                              isActive: checked,
                           }))
                        }
                     />
                     <Label htmlFor="edit-staff-active">
                        Active (can login and work)
                     </Label>
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => {
                        setIsEditStaffOpen(false)
                        setEditingStaff(null)
                        setStaffForm({
                           name: "",
                           email: "",
                           password: "",
                           role: "STAFF",
                           isActive: true,
                           branchId: "",
                        })
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleEditStaff}
                     disabled={
                        isSubmitting ||
                        !staffForm.name.trim() ||
                        !staffForm.email.trim()
                     }
                  >
                     {isSubmitting ? "Updating..." : "Update Staff"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}
