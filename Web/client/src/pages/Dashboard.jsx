import React from "react";
import { Info } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for navigation
import DashboardSidebar from "../components/DashboardSidebar"; // Import Sidebar
import DashboardHeader from "../components/DashboardHeader"; // Import Header
import StatsCard from "../components/StatsCard"; // Import StatsCard

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <DashboardHeader />

        {/* Main Section */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <StatsCard
              label="Total Transaction Amount"
              value="₦500,000.00"
              status="Host"
            />
            <StatsCard label="Total Event Hosted" value="2" />
          </div>

          {/* Transaction History Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Transaction History</h2>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="w-12 h-12 text-[#F5B014] mb-4" />
              <p className="text-gray-600 mb-4">Yet to perform any transaction</p>
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