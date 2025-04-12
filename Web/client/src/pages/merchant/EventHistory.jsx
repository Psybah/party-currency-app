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

export default function EventHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
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
  const events = [
    {
      eventId: "3FV56YGF",
      date: "13-09-2025",
      location: "Kuje,Abuja",
      merchantId: "001231907896",
    },
    {
      eventId: "3FV56YGF",
      date: "13-09-2025",
      location: "Kuje,Abuja",
      merchantId: "001231907896",
    },
    {
      eventId: "3FV56YGF",
      date: "13-09-2025",
      location: "Kuje,Abuja",
      merchantId: "001231907896",
    },
    {
      eventId: "3FV56YGF",
      date: "13-09-2025",
      location: "Kuje,Abuja",
      merchantId: "001231907896",
    },
    {
      eventId: "3FV56YGF",
      date: "13-09-2025",
      location: "Kuje,Abuja",
      merchantId: "001231907896",
    },
    {
      eventId: "3FV56YGF",
      date: "13-09-2025",
      location: "Kuje,Abuja",
      merchantId: "001231907896",
    },
  ];

  const toggleEventSelection = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Format date to be more mobile-friendly
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${day} ${month} ${year}`;
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
            <h1 className="text-2xl font-semibold font-playfair">Event History</h1>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search By Event ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70px]">
                      <Checkbox
                        checked={selectedEvents.length === events.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEvents(
                              events.map((event) => event.eventId)
                            );
                          } else {
                            setSelectedEvents([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-[150px] text-left">Event ID</TableHead>
                    <TableHead className="w-[180px] text-left whitespace-nowrap">Date</TableHead>
                    <TableHead className="w-[200px] text-left">Location</TableHead>
                    <TableHead className="w-[150px] text-left">Merchant ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="text-left">
                        <Checkbox
                          checked={selectedEvents.includes(event.eventId)}
                          onCheckedChange={() =>
                            toggleEventSelection(event.eventId)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-left whitespace-nowrap">{event.eventId}</TableCell>
                      <TableCell className="text-left whitespace-nowrap">
                        {formatDate(event.date)}
                      </TableCell>
                      <TableCell className="text-left">{event.location}</TableCell>
                      <TableCell className="text-left whitespace-nowrap">{event.merchantId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
