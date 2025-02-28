import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EventHistoryTable from "@/components/merchant/EventHistoryTable";

export default function MerchantDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Event History</h1>
          <div className="relative w-72">
            <Input
              type="text"
              placeholder="Search By Event ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <EventHistoryTable searchQuery={searchQuery} />
      </div>
    </DashboardLayout>
  );
} 