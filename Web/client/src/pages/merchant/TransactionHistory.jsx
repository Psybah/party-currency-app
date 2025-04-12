import React, { useState, useEffect } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Search, History, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  // Mock data - replace with actual API call
  const transactions = [
    {
      eventId: "3FV56YGF",
      amount: "50,000",
      machineId: "234567890",
      invoice: "↓",
    },
    {
      eventId: "3FV56YGF",
      amount: "50,000",
      machineId: "234567890",
      invoice: "↓",
    },
    {
      eventId: "3FV56YGF",
      amount: "50,000",
      machineId: "234567890",
      invoice: "↓",
    },
    {
      eventId: "3FV56YGF",
      amount: "50,000",
      machineId: "234567890",
      invoice: "↓",
    },
    {
      eventId: "3FV56YGF",
      amount: "50,000",
      machineId: "234567890",
      invoice: "↓",
    },
    {
      eventId: "3FV56YGF",
      amount: "50,000",
      machineId: "234567890",
      invoice: "↓",
    },
  ];

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <History className="w-8 h-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        {searchQuery 
          ? "No transactions match your search criteria. Try adjusting your filters."
          : "There are no transactions recorded yet."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <MerchantHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold font-playfair">Transaction History</h1>
            
            <div className="w-full md:w-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by Event ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-[300px]"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchTransactions} />
            ) : transactions.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] text-left">Event ID</TableHead>
                      <TableHead className="w-[150px] text-left">Amount</TableHead>
                      <TableHead className="w-[200px] text-left">Machine ID</TableHead>
                      <TableHead className="w-[100px] text-left">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-left whitespace-nowrap">
                          {transaction.eventId}
                        </TableCell>
                        <TableCell className="text-left whitespace-nowrap">
                          ₦{transaction.amount}
                        </TableCell>
                        <TableCell className="text-left whitespace-nowrap">
                          {transaction.machineId}
                        </TableCell>
                        <TableCell className="text-left">
                          <button 
                            className="text-bluePrimary hover:text-blueSecondary"
                            aria-label="Download Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
