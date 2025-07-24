"use client"
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isContentVisible, setIsContentVisible] = useState(false);
  
  // Animation effect for content visibility
  useEffect(() => {
    // Only trigger animation when content should be visible
    if (!isLoading && isAuthenticated && pathname !== "/admin/login") {
      const timer = setTimeout(() => setIsContentVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, pathname]);

  // Authentication redirect effect
  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === "/admin/login") return;
    console.log("isAuthenticated", isAuthenticated);
    
    // Redirect to login if not authenticated and not loading
    if (!isAuthenticated) {
      // Encode the current path as return URL
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/admin/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4 animate-scaleIn">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/20 animate-pulse"></div>
            <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
          </div>
          <p className="text-lg font-medium text-primary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Skip rendering admin layout for login page
  if (!isAuthenticated && pathname === "/admin/login") {
    return <>{children}</>;
  }


  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with slide-in animation */}
      <div className="animate-slideInTop">
        <AdminHeader />
      </div>
      
      <div className="flex flex-1 pt-16"> {/* Added padding top to account for fixed header */}
        {/* Sidebar with slide-in animation */}
        <div className="hidden lg:block lg:fixed lg:top-16 lg:bottom-0 lg:z-10 lg:w-72 lg:overflow-y-auto lg:border-r border-primary/10 bg-sidebar shadow-lg animate-slideInLeft">
          <AdminSidebar />
        </div>
        
        {/* Main content with fade-in animation */}
        <main className={`flex-1 overflow-auto p-4 md:p-6 lg:pl-80 transition-opacity duration-300 ease-in-out ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="animate-scaleIn">
            {children}
          </div>
        </main>
      </div>
      
      {/* Subtle gradient overlay at the bottom for visual interest */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80"></div>
    </div>
  );
}
