import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { EventSuccessModal } from "@/components/events/EventSuccessModal";
import { EventForm } from "@/components/events/EventForm";
import { useAuthenticated } from "@/lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const authenticated = useAuthenticated();

  const [formData, setFormData] = useState({
    event_name: "",
    event_type: "",
    start_date: "",
    end_date: "",
    street_address: "",
    state: "",
    city: "",
    post_code: "",
    LGA: "",
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
    setIsSubmitting(true);

    try {
      const { accessToken } = getAuth();

      // Transform the data for the API
      const requestData = {
        ...formData,
        LGA: formData.LGA.toUpperCase(),
        reconciliation_service: Boolean(formData.reconciliation_service),
      };

      const response = await fetch(`${BASE_URL}/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setEventId(data.event.event_id);
      setShowSuccessModal(true);
      toast.success("Event created successfully!");
      navigate("/manage-event");
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="flex-1 mx-auto p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-4xl">
        <h1 className="mb-4 sm:mb-6 lg:mb-8 font-playfair font-semibold text-xl sm:text-2xl text-left">
          Create Event
        </h1>
        <EventForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </main>

      {showSuccessModal && (
        <EventSuccessModal
          eventId={eventId}
          onClose={() => setShowSuccessModal(false)}
          onNavigate={() => navigate("/templates")}
        />
      )}
    </div>
  );
}
