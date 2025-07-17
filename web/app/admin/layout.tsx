"use client"
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1 pt-16"> {/* Added padding top to account for fixed header */}
        <div className="hidden lg:block lg:fixed lg:top-16 lg:bottom-0 lg:z-10 lg:w-72 lg:overflow-y-auto lg:border-r">
          <AdminSidebar />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:pl-80">{children}</main>
      </div>
    </div>
  );
}
