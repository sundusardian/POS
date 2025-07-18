import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, Edit, FileText, Plus, Search, Trash2 } from "lucide-react";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mock data for transactions
const TRANSACTIONS = [
  {
    id: "TRX-2025-001",
    date: "2025-07-15",
    type: "income",
    category: "Sales",
    description: "Daily sales",
    amount: 4500000,
    branch: "Main Branch",
  },
  {
    id: "TRX-2025-002",
    date: "2025-07-15",
    type: "expense",
    category: "Inventory",
    description: "Grocery purchase",
    amount: 1250000,
    branch: "Main Branch",
  },
  {
    id: "TRX-2025-003",
    date: "2025-07-16",
    type: "income",
    category: "Sales",
    description: "Daily sales",
    amount: 3750000,
    branch: "Main Branch",
  },
  {
    id: "TRX-2025-004",
    date: "2025-07-16",
    type: "expense",
    category: "Utilities",
    description: "Electricity bill",
    amount: 850000,
    branch: "Main Branch",
  },
  {
    id: "TRX-2025-005",
    date: "2025-07-16",
    type: "expense",
    category: "Salary",
    description: "Staff salary",
    amount: 5000000,
    branch: "Main Branch",
  },
  {
    id: "TRX-2025-006",
    date: "2025-07-17",
    type: "income",
    category: "Sales",
    description: "Daily sales",
    amount: 4200000,
    branch: "Main Branch",
  },
  {
    id: "TRX-2025-007",
    date: "2025-07-17",
    type: "expense",
    category: "Rent",
    description: "Monthly rent",
    amount: 7500000,
    branch: "Main Branch",
  },
];

// Mock data for categories
const INCOME_CATEGORIES = [
  { id: 1, name: "Sales" },
  { id: 2, name: "Catering" },
  { id: 3, name: "Events" },
  { id: 4, name: "Other Income" },
];

const EXPENSE_CATEGORIES = [
  { id: 1, name: "Inventory" },
  { id: 2, name: "Salary" },
  { id: 3, name: "Rent" },
  { id: 4, name: "Utilities" },
  { id: 5, name: "Equipment" },
  { id: 6, name: "Marketing" },
  { id: 7, name: "Maintenance" },
  { id: 8, name: "Other Expense" },
];

// Mock data for branches
const BRANCHES = [
  { id: 1, name: "Main Branch" },
  { id: 2, name: "Second Branch" },
  { id: 3, name: "Mall Branch" },
  { id: 4, name: "Bandung Branch" },
];

export default function AccountingManagement() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounting</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s finances and transactions.
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(12450000)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(14600000)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(-2150000)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(3500000)}</div>
            <p className="text-xs text-muted-foreground">
              5 invoices
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select defaultValue="all-types">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all-branches">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Branch" />
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
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-[150px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Pick a date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-1">
                        <Plus className="h-4 w-4" /> Add Transaction
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Add New Transaction</DialogTitle>
                        <DialogDescription>
                          Record a new financial transaction.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="transaction-type">Transaction Type</Label>
                          <Select>
                            <SelectTrigger id="transaction-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="inventory">Inventory</SelectItem>
                              <SelectItem value="salary">Salary</SelectItem>
                              <SelectItem value="rent">Rent</SelectItem>
                              <SelectItem value="utilities">Utilities</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount (IDR)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Input id="description" placeholder="Enter transaction description" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="transaction-date">Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="transaction-date"
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Pick a date</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                        <div className="grid gap-2">
                          <Label htmlFor="receipt">Receipt (Optional)</Label>
                          <Input id="receipt" type="file" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Transaction</Button>
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
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden lg:table-cell">Branch</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TRANSACTIONS.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === "income" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {transaction.description}
                      </TableCell>
                      <TableCell className={cn(
                        "font-medium",
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      )}>
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {transaction.branch}
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
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Reports</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="current-month">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Current Month</SelectItem>
                      <SelectItem value="previous-month">Previous Month</SelectItem>
                      <SelectItem value="current-quarter">Current Quarter</SelectItem>
                      <SelectItem value="year-to-date">Year to Date</SelectItem>
                      <SelectItem value="custom">Custom Period</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-1">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
              <CardDescription>
                View and export financial reports for your restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Income Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Revenue</span>
                          <span className="font-medium">{formatCurrency(12450000)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Expenses</span>
                          <span className="font-medium">{formatCurrency(14600000)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="font-medium">Net Profit/Loss</span>
                          <span className="font-bold text-amber-600">{formatCurrency(-2150000)}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4 w-full gap-1">
                        <FileText className="h-4 w-4" /> View Full Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Inventory</span>
                          <span className="font-medium">{formatCurrency(1250000)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Salary</span>
                          <span className="font-medium">{formatCurrency(5000000)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Rent</span>
                          <span className="font-medium">{formatCurrency(7500000)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Utilities</span>
                          <span className="font-medium">{formatCurrency(850000)}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4 w-full gap-1">
                        <FileText className="h-4 w-4" /> View Full Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue by Branch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full rounded-md border">
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        Revenue chart by branch will be displayed here
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoices</CardTitle>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" /> Create Invoice
                </Button>
              </div>
              <CardDescription>
                Manage invoices for your restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "INV-2025-001",
                      date: "2025-07-15",
                      customer: "PT Mitra Sejahtera",
                      amount: 2500000,
                      status: "paid",
                    },
                    {
                      id: "INV-2025-002",
                      date: "2025-07-16",
                      customer: "PT Global Mandiri",
                      amount: 1750000,
                      status: "pending",
                    },
                    {
                      id: "INV-2025-003",
                      date: "2025-07-17",
                      customer: "PT Jaya Abadi",
                      amount: 3500000,
                      status: "pending",
                    },
                  ].map((invoice, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={invoice.status === "paid" ? "default" : "outline"}
                          className="capitalize"
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
