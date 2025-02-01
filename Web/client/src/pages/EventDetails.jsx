import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await fetch(`https://party-currency-app-production.up.railway.app/events/get/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      return response.json();
    },
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

      <h1 className="text-2xl font-semibold text-center mb-8">EVENT DETAILS</h1>

      <div className="max-w-3xl mx-auto bg-softbg rounded-lg p-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-gray-600">Event Name:</div>
          <div>{event?.event_name}</div>

          <div className="text-gray-600">Creation Date:</div>
          <div>{formatDate(event?.created_at || new Date())}</div>

          <div className="text-gray-600">Event Date:</div>
          <div>{formatDate(event?.event_date)}</div>

          <div className="text-gray-600">Event Address:</div>
          <div>{event?.address}</div>

          <div className="text-gray-600">Delivery Date:</div>
          <div>{formatDate(event?.delivery_date || new Date())}</div>

          <div className="text-gray-600">Delivery Status:</div>
          <div>{event?.delivery_status || 'Pending'}</div>

          <div className="text-gray-600">Amount Paid:</div>
          <div>₦{event?.amount_paid || '0'}</div>

          <div className="text-gray-600">Delivery Address:</div>
          <div>{event?.delivery_address}</div>

          <div className="text-gray-600">Event ID:</div>
          <div>{event?.event_id}</div>

          <div className="text-gray-600">Reconciliation Service:</div>
          <div>{event?.reconciliation_service ? 'Enabled' : 'Disabled'}</div>

          <div className="text-gray-600">Transaction Details:</div>
          <div className="flex gap-4">
            <Button variant="link" className="p-0 h-auto text-bluePrimary">
              Download
            </Button>
            <Button variant="link" className="p-0 h-auto text-bluePrimary">
              View receipt
            </Button>
          </div>

          <div className="text-gray-600">Currency Template:</div>
          <div className="flex gap-4">
            <div className="w-24 h-12 bg-gray-200 rounded"></div>
            <Button variant="link" className="p-0 h-auto text-bluePrimary">
              View template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}