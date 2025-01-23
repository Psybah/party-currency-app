import React, { useState } from "react";
import { Eye, Info, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Button } from "../components/ui/button";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "../components/LoadingDisplay";

const demoOngoingEvents = [
  {
    id: "EVT001",
    name: "Oguntade 50th Birthday Celebration",
    date: "2024-04-15",
    status: "active"
  },
  {
    id: "EVT002",
    name: "Williams Wedding Anniversary",
    date: "2024-05-01",
    status: "active"
  }
];

const demoConcludedEvents = [
  {
    id: "EVT003",
    name: "Johnson's Graduation Party",
    date: "2024-02-20",
    status: "concluded"
  }
];

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

const EmptyState = ({ type }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Info className="w-12 h-12 text-gold mb-4" />
    <p className="mb-4 text-gray-600">No {type} events</p>
    <Link to="/create-event" className="text-gold hover:underline">
      Create an event
    </Link>
  </div>
);

export default function ManageEvent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const authenticated = useAuthenticated();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="bg-white min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="md:pl-[var(--sidebar-width)] transition-all duration-300 ease-in-out">
        <DashboardHeader toggleMobileMenu={toggleMobileMenu} />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-4 mb-6 border-b">
              <button
                className={`pb-2 px-4 ${
                  activeTab === "ongoing"
                    ? "border-b-2 border-gold text-gold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("ongoing")}
              >
                Ongoing Events
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === "concluded"
                    ? "border-b-2 border-gold text-gold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("concluded")}
              >
                Concluded Events
              </button>
            </div>
            
            <div className="mt-6">
              {activeTab === "ongoing" && (
                <div>
                  {demoOngoingEvents.length > 0 ? (
                    demoOngoingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <EmptyState type="ongoing" />
                  )}
                </div>
              )}

              {activeTab === "concluded" && (
                <div>
                  {demoConcludedEvents.length > 0 ? (
                    demoConcludedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <EmptyState type="concluded" />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
