import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {type === "payment" ? (
        <CreditCard className="w-3 h-3 mr-1" />
      ) : (
        <Truck className="w-3 h-3 mr-1" />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default function EventCard({ 
  event, 
  type = "customer", 
  onAdminToggle = null, 
  isAdminExpanded = false 
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      const date = format(new Date(dateString), "MMM dd, yyyy");
      return date;
    } catch (err) {
      console.error("Failed to format date: ", err);
      return "Invalid Date";
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(event.event_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-[#FFFBF5] rounded-t-lg shadow-md p-4 sm:p-6 mt-4 hover:bg-[#FFF9F0] transition-colors duration-200">
      {/* Header: Name, ID, Status */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        {/* Name, ID, Description */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <h3 className="text-lg font-semibold text-gray-900 break-words text-left">
              {event.event_name}
            </h3>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md w-fit">
              <span className="text-xs font-mono text-gray-600 truncate">
                ID: {event.event_id}
              </span>
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
          <p className="text-sm text-gray-600 mt-1 break-words text-left">
            {event.event_description}
          </p>
        </div>
        {/* Status Badges */}
        <div className="flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0">
          <StatusBadge status={event.payment_status} type="payment" />
          <StatusBadge status={event.delivery_status} type="delivery" />
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-4 flex flex-col md:flex-row gap-4">
        {/* Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-start text-sm text-gray-600 break-words text-left">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
            <span>
              {event.street_address}, {event.city}, {event.state}{" "}
              {event.postal_code}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(event.start_date)} - {formatDate(event.end_date)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Created: {formatDate(event.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:items-end sm:items-center items-stretch w-full md:w-auto">
          {event.reconciliation && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span>Reconciled</span>
            </div>
          )}
          {event.payment_status === "pending" && (
            <button
              onClick={() => {
                if (type === "admin") {
                  navigate(`/admin/events/${event.event_id}?action=pay`);
                } else {
                  navigate(`/event/${event.event_id}?action=pay`);
                }
              }}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-bluePrimary rounded-md hover:bg-bluePrimary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluePrimary"
            >
              Make Payment
            </button>
          )}
          <button
            onClick={() => {
              if (type === "admin") {
                navigate(`/admin/events/${event.event_id}`);
              } else {
                navigate(`/event/${event.event_id}`);
              }
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-bluePrimary rounded-md hover:bg-bluePrimary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluePrimary"
          >
            View Details
          </button>
          
          {/* Admin Toggle Button - only show for admin type */}
          {type === "admin" && onAdminToggle && (
            <button
              onClick={() => onAdminToggle(event.event_id)}
              className="w-full sm:w-auto px-3 py-2 text-sm font-medium text-bluePrimary bg-white border border-bluePrimary/30 rounded-md hover:bg-bluePrimary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluePrimary transition-colors duration-200"
            >
              <div className="flex items-center justify-center gap-1">
                <Settings className="w-3 h-3" />
                <span>Admin</span>
                {isAdminExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    event_id: PropTypes.string.isRequired,
    event_name: PropTypes.string.isRequired,
    event_description: PropTypes.string,
    payment_status: PropTypes.string.isRequired,
    delivery_status: PropTypes.string.isRequired,
    street_address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postal_code: PropTypes.string,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    reconciliation: PropTypes.bool,
  }).isRequired,
  type: PropTypes.string,
  onAdminToggle: PropTypes.func,
  isAdminExpanded: PropTypes.bool,
};
