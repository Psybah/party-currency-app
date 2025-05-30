import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../admin/AdminSidebar";
import { AdminHeader } from "../admin/AdminHeader";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener("sidebarStateChange", handleSidebarStateChange);
    return () => {
      window.removeEventListener(
        "sidebarStateChange",
        handleSidebarStateChange
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <AdminHeader toggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
