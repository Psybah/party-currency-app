import { useState } from "react";
import PropTypes from "prop-types";
import { X, CheckCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function EventSuccessModal({ eventId, onClose }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventId);
      setCopied(true);
      toast.success("Event ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy Event ID");
    }
  };

  const handleNavigateToTemplates = () => {
    // Store the event ID in session storage for persistence across page reloads
    sessionStorage.setItem('lastCreatedEventId', eventId);
    // Navigate to templates with the event ID
    navigate("/templates", { state: { fromEvent: true, eventId } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg max-w-md w-full mx-3 sm:mx-0">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-green-600 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base">Event Created Successfully!</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
          Below is your unique Event ID. You can copy it for future reference.
        </p>
        <div className="bg-gray-100 p-2 sm:p-3 rounded mb-3 sm:mb-4 flex items-center justify-between">
          <code className="text-sm sm:text-lg font-mono break-all mr-2">{eventId}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="ml-2 flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
          >
            {copied ? (
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
        <Button
          className="w-full bg-bluePrimary hover:bg-bluePrimary/90 text-white h-10 sm:h-11 text-sm sm:text-base"
          onClick={handleNavigateToTemplates}
        >
          Choose Currency Template
        </Button>
      </div>
    </div>
  );
}

EventSuccessModal.propTypes = {
  eventId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};