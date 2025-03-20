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
          <h1 className="font-semibold text-2xl">Event History</h1>
          <div className="relative w-72">
            <Input
              type="text"
              placeholder="Search By Event ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          </div>
        </div>

        <EventHistoryTable searchQuery={searchQuery} />
      </div>
    </DashboardLayout>
  );
}
