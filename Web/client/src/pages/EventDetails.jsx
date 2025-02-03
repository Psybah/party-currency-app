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
    queryKey: ['event', eventId],
    queryFn: async () => {
      console.log("Fetching event details for ID:", eventId);
      const response = await fetch(`https://party-currency-app-production.up.railway.app/events/get/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const data = await response.json();
      console.log("Event details response:", data);
      return data;
    },
    onError: (error) => {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details");
    }
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/manage-event')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <h1 className="text-2xl font-semibold mb-8">EVENT DETAILS</h1>

      <div className="max-w-3xl mx-auto bg-softbg rounded-lg p-8">
        <div className="space-y-6">
          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem 
              label="Event Name" 
              value={event?.event_name || 'N/A'} 
            />
            <DetailItem 
              label="Creation Date" 
              value={event?.created_at ? formatDate(event.created_at) : 'N/A'} 
            />
            <DetailItem 
              label="Event Date" 
              value={event?.event_date ? formatDate(event.event_date) : 'N/A'} 
            />
            <DetailItem 
              label="Event Address" 
              value={event?.address || 'N/A'} 
            />
            <DetailItem 
              label="Delivery Date" 
              value={event?.delivery_date ? formatDate(event.delivery_date) : 'N/A'} 
            />
            <DetailItem 
              label="Delivery Status" 
              value={event?.delivery_status || 'Pending'} 
            />
            <DetailItem 
              label="Amount Paid" 
              value={`₦${event?.amount_paid?.toLocaleString() || '0'}`} 
            />
            <DetailItem 
              label="Delivery Address" 
              value={event?.delivery_address || 'N/A'} 
            />
            <DetailItem 
              label="Event ID" 
              value={event?.event_id || eventId || 'N/A'} 
            />
            <DetailItem 
              label="Reconciliation Service" 
              value={event?.reconciliation_service ? 'Enabled' : 'Disabled'} 
            />
          </div>

          {/* Transaction Details */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 text-left">Transaction Details</h2>
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
            <h2 className="text-lg font-semibold mb-4 text-left">Currency Template</h2>
            <div className="flex gap-4">
              <div className="w-24 h-12 bg-gray-200 rounded"></div>
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
    <div className="text-gray-600 mb-1">{label}:</div>
    <div className="font-medium">{value}</div>
  </div>
);