import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronsUpDown,
  ClipboardList,
  Coffee,
  Home,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  Utensils,
  Wallet,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

function SidebarItem({ href, icon, title, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover-lift",
        isActive 
          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary shadow-sm" 
          : "text-foreground hover:bg-primary/5 hover:text-primary border-l-2 border-transparent"
      )}
    >
      <div className={cn(
        "transition-all duration-300",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
      )}>
        {icon}
      </div>
      <span>{title}</span>
    </Link>
  );
}

interface SidebarGroupProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarGroup({ icon, title, children, defaultOpen = false }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full mb-1"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium",
            "transition-all duration-300 hover:bg-primary/5 group",
            isOpen && "bg-primary/5 text-primary border-l-2 border-primary",
            !isOpen && "border-l-2 border-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "transition-colors duration-300",
              isOpen ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {icon}
            </div>
            <span className={cn(
              "transition-colors duration-300",
              isOpen && "text-primary font-medium"
            )}>{title}</span>
          </div>
          <ChevronsUpDown className={cn(
            "h-4 w-4 transition-transform duration-300",
            isOpen ? "rotate-180 text-primary" : "text-muted-foreground group-hover:text-primary"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 pt-1 animate-slideInTop overflow-hidden">
        <div className="border-l border-primary/20 pl-2 space-y-1">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="flex h-full w-64 flex-col border-r bg-background animate-fadeIn">
      {/* Gradient accent at top of sidebar */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      
      <div className="flex h-16 items-center border-b border-primary/10 px-4 bg-sidebar">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 font-semibold hover-scale transition-all duration-300 text-primary"
        >
          <Coffee className="h-6 w-6 text-primary animate-pulse" />
          <span className="text-lg tracking-tight">POS Admin</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4 space-y-1">
        <nav className="grid gap-1.5 px-2">
          <SidebarItem
            href="/admin"
            icon={<LayoutDashboard className="h-4 w-4" />}
            title="Dashboard"
            isActive={pathname === "/admin"}
          />
          
          <SidebarGroup
            icon={<Utensils className="h-4 w-4" />}
            title="Menu"
            defaultOpen={pathname.startsWith("/admin/menu")}
          >
            <SidebarItem
              href="/admin/menu"
              icon={<ClipboardList className="h-4 w-4" />}
              title="Menu Items"
              isActive={pathname === "/admin/menu"}
            />
            <SidebarItem
              href="/admin/menu/categories"
              icon={<Package className="h-4 w-4" />}
              title="Categories"
              isActive={pathname === "/admin/menu/categories"}
            />
          </SidebarGroup>
          
          <SidebarItem
            href="/admin/orders"
            icon={<ShoppingCart className="h-4 w-4" />}
            title="Order Management"
            isActive={pathname === "/admin/orders"}
          />
          
          <SidebarItem
            href="/admin/staff"
            icon={<Users className="h-4 w-4" />}
            title="Staff Management"
            isActive={pathname === "/admin/staff"}
          />
          
          <SidebarItem
            href="/admin/branches"
            icon={<Store className="h-4 w-4" />}
            title="Branch Management"
            isActive={pathname === "/admin/branches"}
          />
          
          <SidebarItem
            href="/admin/inventory"
            icon={<Package className="h-4 w-4" />}
            title="Inventory"
            isActive={pathname === "/admin/inventory"}
          />
          
          <SidebarItem
            href="/admin/accounting"
            icon={<Wallet className="h-4 w-4" />}
            title="Accounting"
            isActive={pathname === "/admin/accounting"}
          />
          
          <SidebarItem
            href="/admin/desks"
            icon={<Home className="h-4 w-4" />}
            title="Desk Management"
            isActive={pathname === "/admin/desks"}
          />
          
          <SidebarItem
            href="/admin/settings"
            icon={<Settings className="h-4 w-4" />}
            title="Settings"
            isActive={pathname === "/admin/settings"}
          />
        </nav>
      </div>
    </div>
  );
}
