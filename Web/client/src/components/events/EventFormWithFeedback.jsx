import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { EventBasicInfo } from "./EventBasicInfo";
import { EventDateInfo } from "./EventDateInfo";
import { EventLocationInfo } from "./EventLocationInfo";
import { ReconciliationSection } from "./ReconciliationSection";
import { EventSuccessModal } from "./EventSuccessModal";
import { showSuccess, showError, withFeedback } from "@/utils/feedback";
import { formatErrorMessages } from "@/utils/feedback";
import { createEvent } from "@/services/eventService";
import { useNavigate } from "react-router-dom";
import { getAuth } from "@/lib/util";

export const EventFormWithFeedback = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const [showReconciliationInfo, setShowReconciliationInfo] = useState(false);
  const [customEventType, setCustomEventType] = useState("");

  // Initial form data
  const [formData, setFormData] = useState({
    event_name: "",
    event_type: "",
    start_date: "",
    end_date: "",
    street_address: "",
    state: "",
    city: "",
    lga: "",
    post_code: "",
    reconciliation_service: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (!formData.event_name || !formData.event_type) {
      showError("Please fill in all required fields");
      return;
    }

    // Format the data for the API
    const eventData = {
      ...formData,
      event_type:
        formData.event_type === "other" ? customEventType : formData.event_type,
    };

    try {
      setIsSubmitting(true);

      // Using withFeedback for the API call
      const result = await withFeedback(
        async () => {
          const { accessToken } = getAuth();

          // Prepare API call payload
          const payload = {
            event_name: eventData.event_name,
            event_type: eventData.event_type,
            event_date: eventData.start_date,
            address: `${eventData.street_address}, ${eventData.city}, ${eventData.state}`,
            reconciliation_service: eventData.reconciliation_service,
          };

          const response = await createEvent(payload, accessToken);
          return response;
        },
        {
          loadingMessage: "Creating your event...",
          successMessage: "Event created successfully!",
          transform: (result) => {
            // Store event ID for success modal
            if (result.event_id) {
              setEventId(result.event_id);
              setShowSuccessModal(true);
            }
            return result;
          },
        }
      );
    } catch (error) {
      // Format the error message nicely
      const errorMessage = formatErrorMessages(error);
      showError(errorMessage);
      console.error("Create event error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleNavigateToTemplates = () => {
    navigate("/templates");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <EventBasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            customEventType={customEventType}
            setCustomEventType={setCustomEventType}
          />

          <EventDateInfo
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <EventLocationInfo
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <ReconciliationSection
          formData={formData}
          handleInputChange={handleInputChange}
          showReconciliationInfo={showReconciliationInfo}
          setShowReconciliationInfo={setShowReconciliationInfo}
        />

        <Button
          type="submit"
          className="bg-gold hover:bg-gold/90 px-8 w-full md:w-auto text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 w-4 h-4 animate-spin" />
              Creating Event...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      </form>

      {/* Success Modal with Event ID */}
      {showSuccessModal && (
        <EventSuccessModal
          eventId={eventId}
          onClose={handleCloseSuccessModal}
          onNavigate={handleNavigateToTemplates}
        />
      )}
    </>
  );
};
