import React, { useState } from "react";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "../components/StatsCard";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="md:pl-64">
        <DashboardHeader toggleMobileMenu={toggleMobileMenu} />

        {/* Main Section */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="gap-6 text-left grid grid-cols-1 md:grid-cols-2 mb-8">
            <StatsCard
              label="Total Transaction Amount"
              value="₦500,000.00"
              status="Host"
            />
            <StatsCard label="Total Event Hosted" value="2" />
          </div>

          {/* Transaction History Section */}
          <section>
            <h2 className="mb-6 font-semibold text-xl">Transaction History</h2>

            {/* Empty State */}
            <div className="flex flex-col justify-center items-center py-12 text-center">
              <Info className="mb-4 w-12 h-12 text-[#F5B014]" />
              <p className="mb-4 text-gray-600">
                Yet to perform any transaction
              </p>
              <Link
                to="/create-event"
                className="text-[#F5B014] hover:underline"
              >
                Create an event
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
