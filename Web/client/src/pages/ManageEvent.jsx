import React from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";

export default function ManageEvent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const authenticated = useAuthenticated();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return authenticated ? (
    <div className="bg-white min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="md:pl-64">
        <DashboardHeader toggleMobileMenu={toggleMobileMenu} />

        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Manage Event</h1>
          
          {/* Placeholder content - to be implemented */}
          <div className="text-gray-600">
            Event management features will be implemented here.
          </div>
        </main>
      </div>
    </div>
  ) : (
    <LoadingDisplay />
  );
}