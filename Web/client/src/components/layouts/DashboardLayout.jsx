import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../DashboardSidebar";
import DashboardHeader from "../DashboardHeader";

export default function DashboardLayout() {
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
    <div className="bg-gray-50 min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <DashboardHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
