import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    lga: "",
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
        lga: formData.lga.toUpperCase(),
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

      setEventId(data.event_id);
      setShowSuccessModal(true);
      toast.success("Event created successfully!");
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
    <div className="min-h-screen bg-white">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <DashboardHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-8 text-left">Create Event</h1>
          <EventForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </main>
      </div>

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