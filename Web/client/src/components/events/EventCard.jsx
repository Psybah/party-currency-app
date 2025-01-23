import React from "react";
import { Eye, Wallet } from "lucide-react";
import { Button } from "../ui/button";

const EventCard = ({ event }) => (
  <div className="bg-softbg rounded-lg p-4 mb-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-left">
        <h3 className="text-lg font-semibold">{event.name}</h3>
        <p className="text-sm text-gray-600">{event.date}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="bg-gold hover:bg-gold/90 text-white md:px-6"
        >
          <Eye className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">View</span>
        </Button>
        <Button
          variant="outline"
          className="bg-gray-800 hover:bg-gray-700 text-white md:px-6"
        >
          <Wallet className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Wallet</span>
        </Button>
      </div>
    </div>
  </div>
);

export default EventCard;