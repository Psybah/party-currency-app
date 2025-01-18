import React, { useState } from "react";
import { Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthenticated } from "@/lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { getAuth } from "@/lib/util";
import { createEventApi } from "@/api/eventApi";

const eventTypes = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Corporate Event",
  "Other",
];

const cities = ["Lagos", "Ibadan", "Abuja", "Port Harcourt", "Kano"];
const countries = ["Nigeria"];
const lgas = ["Ibadan North", "Ibadan South", "Akinyele", "Egbeda"];

export default function CreateEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const navigate = useNavigate();
  const authenticated = useAuthenticated();

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting");
    const payload = {
      event_name: eventName,
      event_description: eventDescription,
      event_date: eventDate,
      address,
      delivery_address: deliveryAddress,
    };
    setIsSubmitting(true);
    setError("");

    try {
      const response = await createEventApi(payload);
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const result = await response.json();
      setEventId(result.event_id);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="bg-white min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col md:pl-64 min-h-screen">
        <DashboardHeader />
        <main className="flex-1 mx-auto p-4 md:p-8 w-full max-w-4xl">
          <h1 className="mb-8 font-semibold text-2xl text-left">
            Event Details
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div>
              <label>Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div>
              <label>Event Description</label>
              <input
                type="text"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Event Date</label>
              <div className="relative max-w-sm">
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
                <Calendar className="top-2.5 right-3 absolute w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label>Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>

            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

            <Button
              type="submit"
              className="bg-gold hover:bg-gold/90 px-8 w-full md:w-auto text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </main>
      </div>

      {showSuccessModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-green-600 text-xl">
                Event Created Successfully!
              </h2>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4 text-gray-600">
              Below is your unique Event ID. You can copy it for future
              reference.
            </p>
            <div className="bg-gray-100 mb-4 p-3 rounded text-center">
              <code>{eventId}</code>
            </div>
            <Button
              className="bg-blueSecondary hover:bg-blueSecondary/90 w-full text-white"
              onClick={() => navigate("/templates")}
            >
              Choose Currency Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
