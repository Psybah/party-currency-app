import React from "react";
import { Calendar, MapPin, Clock, CreditCard, Truck, CheckCircle2, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const StatusBadge = ({ status, type }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {type === "payment" ? <CreditCard className="w-3 h-3 mr-1" /> : <Truck className="w-3 h-3 mr-1" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function EventCard({ event }) {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(event.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-[#FFFBF5] rounded-lg shadow-sm p-6 mb-4 hover:bg-[#FFF9F0] transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md">
              <span className="text-xs font-mono text-gray-600">ID: {event.id}</span>
              <button
                onClick={handleCopyId}
                className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                title="Copy Event ID"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={event.status.payment} type="payment" />
          <StatusBadge status={event.status.delivery} type="delivery" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {event.location.street}, {event.location.city}, {event.location.state} {event.location.postalCode}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {formatDate(event.dates.start)} - {formatDate(event.dates.end)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Created: {formatDate(event.dates.created)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          {event.reconciliation && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span>Reconciled</span>
            </div>
          )}
          <button
            onClick={() => window.location.href = `/events/${event.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}