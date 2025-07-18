"use client";
import { Bell, ChevronDown, Menu, Search, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onMobileMenuToggle?: () => void;
}

export function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6 shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Decorative gradient line at top of header */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onMobileMenuToggle}
            className="hover-scale hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            <Menu className="h-5 w-5 text-primary" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 border-r-primary/20">
          <AdminSidebar />
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1">
        <form className="hidden md:block">
          <div className="relative animate-fadeIn">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary transition-colors duration-200" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3 border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30"
            />
          </div>
        </form>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover-scale hover:bg-primary/10 transition-all duration-200"
        >
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 hover-lift px-2 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                <AvatarImage src={user?.avatar || "/avatars/admin.png"} alt={user?.name || "Admin"} />
                <AvatarFallback className="bg-primary/10 text-primary">{user?.name?.substring(0, 2) || "AD"}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-sm md:flex">
                <span className="font-medium">{user?.name || "Admin User"}</span>
                <span className="text-xs text-primary/70">{user?.email || "admin@example.com"}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-primary/70 transition-transform duration-200 group-hover:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate-scaleIn w-56 border-primary/20">
            <DropdownMenuLabel className="text-primary font-medium">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary/10" />
            <DropdownMenuItem className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-200 cursor-pointer">
              <User className="mr-2 h-4 w-4 text-primary" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-200 cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-secondary" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary/10" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="hover:bg-destructive/10 focus:bg-destructive/20 hover:text-destructive transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 text-destructive" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
