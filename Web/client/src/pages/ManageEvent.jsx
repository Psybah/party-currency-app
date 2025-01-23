import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "../components/LoadingDisplay";
import EventCard from "../components/events/EventCard";
import EventTabs from "../components/events/EventTabs";
import EmptyState from "../components/events/EmptyState";

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

export default function ManageEvent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const authenticated = useAuthenticated();

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
        <DashboardHeader toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
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