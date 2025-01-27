import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "../components/LoadingDisplay";
import EventCard from "../components/events/EventCard";
import EventTabs from "../components/events/EventTabs";
import EmptyState from "../components/events/EmptyState";
import { useEffect } from "react";
import { getEvents } from "@/services/eventService";

// const events = [
//   {
//     id: "EVT001",
//     name: "Oguntade 50th Birthday Celebration",
//     date: "2024-04-15",
//     status: "active",
//   },
//   {
//     id: "EVT002",
//     name: "Williams Wedding Anniversary",
//     date: "2024-05-01",
//     status: "active",
//   },
// ];

// const events = [
//   {
//     id: "EVT003",
//     name: "Johnson's Graduation Party",
//     date: "2024-02-20",
//     status: "concluded",
//   },
// ];

export default function ManageEvent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const authenticated = useAuthenticated();
  const [events, setEvents] = useState([]);
  const fetchEvents = async () => {
    let events_fetched = await getEvents();
    console.log({ events_fetched });
    events_fetched = events_fetched.events.map((event) => {
      let defaultValues = {
        id: "EVT002",
        name: "Williams Wedding Anniversary",
        date: "2024-05-01",
        status: "active",
      };
      return {
        ...defaultValues,
        name: event.event_name,
        id: event.event_id,
        date: new Date().toISOString().split("T")[0],
      };
    });
    setEvents(events_fetched);
  };
  useEffect(() => {
    fetchEvents();
  }, []);

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
        <DashboardHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-6">
              {activeTab === "ongoing" && (
                <div>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <EmptyState type="ongoing" />
                  )}
                </div>
              )}

              {activeTab === "concluded" && (
                <div>
                  {events.length > 0 ? (
                    events.map((event) => (
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
