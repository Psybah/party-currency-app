import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      console.log("Fetching event details for ID:", eventId);
      const response = await fetch(
        `https://party-currency-app-production.up.railway.app/events/get/${eventId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }
      const data = await response.json();
      console.log("Event details response:", data);
      return data.event;
    },
    onError: (error) => {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details");
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="bg-white p-8 min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate("/manage-event")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Events
      </Button>

      <h1 className="mb-8 font-playfair font-semibold text-2xl">
        EVENT DETAILS
      </h1>

      <div className="bg-softbg mx-auto p-8 rounded-lg max-w-3xl">
        <div className="space-y-6">
          {/* Event Details Grid */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <DetailItem label="Event Name" value={event?.event_name || "N/A"} />
            <DetailItem
              label="Creation Date"
              value={event?.created_at ? formatDate(event.created_at) : "N/A"}
            />
            <DetailItem
              label="Event Date"
              value={
                event?.start_date
                  ? `${formatDate(event.start_date)} - ${formatDate(
                      event.end_date
                    )}`
                  : "N/A"
              }
            />
            <DetailItem
              label="Event Address"
              value={
                event?.street_address +
                  (event?.state ? ", " + event.state : "") || "N/A"
              }
            />
            <DetailItem
              label="Delivery Date"
              value={
                event?.delivery_date ? formatDate(event.delivery_date) : "N/A"
              }
            />
            <DetailItem
              label="Delivery Status"
              value={event?.delivery_status || "Pending"}
            />
            <DetailItem
              label="Amount Paid"
              value={`₦${event?.amount_paid?.toLocaleString() || "0"}`}
            />
            <DetailItem
              label="Delivery Address"
              value={event?.delivery_address || "N/A"}
            />
            <DetailItem
              label="Event ID"
              value={event?.event_id || eventId || "N/A"}
            />
            <DetailItem
              label="Reconciliation Service"
              value={event?.reconciliation ? "Enabled" : "Disabled"}
            />
          </div>

          {/* Transaction Details */}
          <div className="mt-8">
            <h2 className="mb-4 font-semibold text-lg text-left">
              Transaction Details
            </h2>
            <div className="flex gap-4">
              <Button variant="link" className="p-0 h-auto text-bluePrimary">
                Download
              </Button>
              <Button variant="link" className="p-0 h-auto text-bluePrimary">
                View receipt
              </Button>
            </div>
          </div>

          {/* Currency Template */}
          <div className="mt-8">
            <h2 className="mb-4 font-semibold text-lg text-left">
              Currency Template
            </h2>
            <div className="flex gap-4">
              <div className="bg-gray-200 rounded w-24 h-12"></div>
              <Button variant="link" className="p-0 h-auto text-bluePrimary">
                View template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent detail item display
const DetailItem = ({ label, value }) => (
  <div className="text-left">
    <div className="mb-1 text-gray-600">{label}:</div>
    <div className="font-medium">{value}</div>
  </div>
);
