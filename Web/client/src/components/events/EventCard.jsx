import React from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Eye, Wallet } from "lucide-react";

export default function EventCard({ event }) {
  return (
    <div className="bg-softbg rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
          <p className="text-gray-600">Date: {formatDate(event.start_date || event.date)}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="bg-gold text-white hover:bg-gold/90"
          >
            <Eye className="h-4 w-4" />
            <span className="ml-2 hidden md:inline">View</span>
          </Button>
          <Button 
            variant="outline"
            className="bg-paragraph text-white hover:bg-paragraph/90"
          >
            <Wallet className="h-4 w-4" />
            <span className="ml-2 hidden md:inline">Wallet</span>
          </Button>
        </div>
      </div>
    </div>
  );
}