import React, { useState } from "react";
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
    const amount = typeof event.amount === 'number' ? event.amount : 0;
    return sum + amount;
  }, 0);
  
  const totalEvents = events.length;

  // Transform events into transaction format with actual data
  const transactions = events.map(event => ({
    id: event.event_id || 'N/A',
    amount: typeof event.amount === 'number' ? event.amount : 0,
    date: event.created_at || new Date().toISOString(),
    status: event.status?.toLowerCase() || "pending",
    invoiceUrl: `/api/invoices/${event.event_id}` // Replace with real invoice URL
  }));

  console.log("Transformed transactions:", transactions); // Debug log

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded"
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

      <div className="md:pl-64">
        <DashboardHeader 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />

        <main className="p-6">
          {isLoading ? (
            <LoadingDisplay message="Loading dashboard..." />
          ) : (
            <>
              <div className="gap-6 text-left grid grid-cols-1 md:grid-cols-2 mb-8">
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
                <h2 className="mb-6 font-semibold text-xl">Transaction History</h2>
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