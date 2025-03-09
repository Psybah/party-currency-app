import React, { useState } from "react";
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <MerchantSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex flex-col md:pl-64 min-h-screen">
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
                  <TableHead>Event ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Merchant ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedEvents.includes(event.eventId)}
                        onCheckedChange={() =>
                          toggleEventSelection(event.eventId)
                        }
                      />
                    </TableCell>
                    <TableCell>{event.eventId}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.merchantId}</TableCell>
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
