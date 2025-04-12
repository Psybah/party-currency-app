import React, { useState, useEffect } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const toggleTransactionSelection = (eventId) => {
    setSelectedTransactions((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <MerchantSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      }`}>
        <MerchantHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 p-4 md:p-8">
          <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search By Event ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-softbg pr-10 w-full"
              />
              <Search className="top-1/2 right-3 absolute w-5 h-5 text-blueSecondary transform -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedTransactions.length === transactions.length
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransactions(
                            transactions.map((tx) => tx.eventId)
                          );
                        } else {
                          setSelectedTransactions([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Machine ID</TableHead>
                  <TableHead className="w-12">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="py-4">
                      <Checkbox
                        checked={selectedTransactions.includes(
                          transaction.eventId
                        )}
                        onCheckedChange={() =>
                          toggleTransactionSelection(transaction.eventId)
                        }
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      {transaction.eventId}
                    </TableCell>
                    <TableCell className="py-4">{transaction.amount}</TableCell>
                    <TableCell className="py-4">
                      {transaction.machineId}
                    </TableCell>
                    <TableCell className="py-4">
                      <button className="text-bluePrimary hover:text-blueSecondary">
                        <span className="sr-only">Download Invoice</span>↓
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
