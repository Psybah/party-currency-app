import React, { useState } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data - replace with actual API call
  const transactions = [
    { eventId: "3FV56YGF", amount: "50,000", machineId: "234567890", invoice: "↓" },
    { eventId: "3FV56YGF", amount: "50,000", machineId: "234567890", invoice: "↓" },
    { eventId: "3FV56YGF", amount: "50,000", machineId: "234567890", invoice: "↓" },
    { eventId: "3FV56YGF", amount: "50,000", machineId: "234567890", invoice: "↓" },
    { eventId: "3FV56YGF", amount: "50,000", machineId: "234567890", invoice: "↓" },
    { eventId: "3FV56YGF", amount: "50,000", machineId: "234567890", invoice: "↓" },
  ];

  const toggleTransactionSelection = (eventId) => {
    setSelectedTransactions(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantSidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="md:pl-64 flex flex-col min-h-screen">
        <MerchantHeader 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex-1 max-w-md relative">
              <Input
                type="text"
                placeholder="Search By Event ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-softbg pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blueSecondary w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTransactions.length === transactions.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransactions(transactions.map(tx => tx.eventId));
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
                        checked={selectedTransactions.includes(transaction.eventId)}
                        onCheckedChange={() => toggleTransactionSelection(transaction.eventId)}
                      />
                    </TableCell>
                    <TableCell className="py-4">{transaction.eventId}</TableCell>
                    <TableCell className="py-4">{transaction.amount}</TableCell>
                    <TableCell className="py-4">{transaction.machineId}</TableCell>
                    <TableCell className="py-4">
                      <button className="text-bluePrimary hover:text-blueSecondary">
                        <span className="sr-only">Download Invoice</span>
                        ↓
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
