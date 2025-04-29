import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PropTypes from 'prop-types';

export function EventDetailsModal({ isOpen, onClose, eventId }) {
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    enabled: isOpen, // Only fetch when modal is open
    queryFn: async () => {
      console.log("Fetching event details for ID:", eventId);
      const { accessToken } = getAuth();
      
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${BASE_URL}/events/get/${eventId}`,
        {
          headers: {
            'Authorization': `Token ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Event not found");
        }
        throw new Error("Failed to fetch event details");
      }
      
      const data = await response.json();
      console.log("Event details response:", data);
      return data.event;
    },
    onError: (error) => {
      console.error("Error fetching event details:", error);
      toast.error(error.message || "Failed to load event details");
    },
  });

  const eventAddress = event?.street_address + (event?.state ? ", " + event.state : "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <DialogTitle className="text-2xl font-playfair">Event Details</DialogTitle>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <DetailItem label="Event Name" value={event?.event_name || "N/A"} />
              <DetailItem
                label="Created"
                value={event?.created_at ? formatDate(event.created_at) : "N/A"}
              />
              <DetailItem
                label="Date"
                value={
                  event?.start_date
                    ? `${formatDate(event.start_date)} - ${formatDate(
                        event.end_date
                      )}`
                    : "N/A"
                }
              />
              <DetailItem
                label="Location"
                value={eventAddress || "N/A"}
              />
              <DetailItem
                label="Delivery"
                value={event?.start_date ? formatDate(event.start_date) : "N/A"}
                note="Will be delivered on event start date"
              />
              <DetailItem
                label="Status"
                value={event?.delivery_status || "Pending"}
              />
              <DetailItem
                label="Amount"
                value={`₦${event?.amount_paid?.toLocaleString() || "0"}`}
              />
              <DetailItem
                label="Delivery To"
                value={eventAddress || "N/A"}
                note="Same as event location"
              />
              <DetailItem
                label="ID"
                value={event?.event_id || eventId || "N/A"}
              />
              <DetailItem
                label="Reconciliation"
                value={event?.reconciliation_service ? "Enabled" : "Disabled"}
              />
            </div>

            {/* Transaction Details */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Details</h3>
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
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Currency Template</h3>
              <div className="flex gap-4">
                <div className="bg-gray-200 rounded w-24 h-12"></div>
                <Button variant="link" className="p-0 h-auto text-bluePrimary">
                  View template
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

EventDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired,
};

// Helper component for consistent detail item display
const DetailItem = ({ label, value, note }) => (
  <div className="text-left">
    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
    <div className="text-base font-medium">{value}</div>
    {note && <div className="text-xs text-gray-400 mt-0.5 italic">{note}</div>}
  </div>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  note: PropTypes.string,
}; 