import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "../components/LoadingDisplay";
import EventCard from "../components/events/EventCard";
import EventTabs from "../components/events/EventTabs";
import EmptyState from "../components/events/EmptyState";
import { useEffect } from "react";
import { getEvents } from "@/api/eventApi";

// Create a skeleton loader component
const EventCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-4 flex gap-3">
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function ManageEvent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authenticated = useAuthenticated();

  // Add sidebar collapse listener
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      let events_fetched = await getEvents();
      console.log({ events_fetched });
      events_fetched = events_fetched.events.map((event) => {
        return {
          id: event.event_id,
          name: event.event_name,
          description: event.event_description,
          location: {
            street: event.street_address,
            city: event.city,
            state: event.state,
            postalCode: event.postal_code
          },
          dates: {
            start: event.start_date,
            end: event.end_date,
            created: event.created_at
          },
          status: {
            payment: event.payment_status?.toLowerCase() || "unpaid",
            delivery: event.delivery_status?.toLowerCase() || "pending"
          },
          reconciliation: event.reconciliation || false,
          concluded: event.concluded || false
        };
      });
      setEvents(events_fetched);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  // Filter events based on active tab
  const filteredEvents = events.filter(event => {
    if (activeTab === "ongoing") {
      return !event.concluded;
    } else {
      return event.concluded;
    }
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div>
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      );
    }

    if (filteredEvents.length === 0) {
      return <EmptyState type={activeTab} />;
    }

    return (
      <div>
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      }`}>
        <DashboardHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
