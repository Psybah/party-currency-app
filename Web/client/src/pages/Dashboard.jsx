import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "../components/StatsCard";
import TransactionTable from "../components/TransactionTable";
import { LoadingDisplay } from "../components/LoadingDisplay";
import EmptyState from "../components/events/EmptyState";
import { getEvents } from "../services/eventService";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    onError: (error) => {
      console.error("Error fetching events:", error);
      toast.error(error.message || "Failed to fetch events");
    },
  });

  console.log("Dashboard data:", data); // Debug log

  // Ensure events is always an array
  const events = data?.events || [];

  // Calculate total stats with safeguards
  const totalAmount = events.reduce((sum, event) => {
    const amount = typeof event.amount === "number" ? event.amount : 0;
    return sum + amount;
  }, 0);

  const totalEvents = events.length;

  // Transform events into transaction format with proper date handling
  const transactions = events.map((event) => ({
    id: event.event_id || "N/A",
    amount: typeof event.amount === "number" ? event.amount : 0,
    date: event.created_at || event.date || new Date().toISOString(), // Prioritize created_at or event date
    status: event.status?.toLowerCase() || "pending",
    invoiceUrl: `/api/invoices/${event.event_id}`,
  }));

  console.log("Transformed transactions:", transactions); // Debug log

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add this effect to all dashboard pages
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  if (error) {
    return (
      <div className="bg-gray-50 p-4 min-h-screen">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-2xl text-gray-900">
            Unable to load dashboard
          </h2>
          <p className="mb-4 text-gray-600">
            {error.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold hover:bg-gold/90 px-4 py-2 rounded text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      }`}>
        <DashboardHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="p-6">
          {isLoading ? (
            <LoadingDisplay message="Loading dashboard..." />
          ) : (
            <>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-8 text-left">
                <StatsCard
                  label="Total Transaction Amount"
                  value={`₦${totalAmount.toLocaleString()}`}
                  status="Host"
                />
                <StatsCard
                  label="Total Events Hosted"
                  value={totalEvents.toString()}
                />
              </div>

              <section>
                <h2 className="mb-6 font-playfair font-semibold text-xl">
                  Transaction History
                </h2>
                {events.length === 0 ? (
                  <EmptyState type="ongoing" />
                ) : (
                  <TransactionTable
                    transactions={filteredTransactions}
                    onSearch={setSearchTerm}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
