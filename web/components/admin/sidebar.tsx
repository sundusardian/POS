import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronsUpDown,
  ClipboardList,
  Coffee,
  Home,
  LayoutDashboard,
  Package,
  Settings,
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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
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
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            {icon}
            <span>{title}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Coffee className="h-6 w-6" />
          <span>POS Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
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
