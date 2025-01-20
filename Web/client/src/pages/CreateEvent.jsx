import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { eventSchema } from "@/lib/validations/event";
import { useAuthenticated } from "@/lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { EventSuccessModal } from "@/components/events/EventSuccessModal";
import { createEvent } from "@/services/eventService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const eventTypes = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Corporate Event",
  "Burial",
  "Other",
];

const cities = ["Lagos", "Ibadan", "Abuja", "Port Harcourt", "Kano"];
const countries = ["Nigeria"];
const lgas = ["Ibadan North", "Ibadan South", "Akinyele", "Egbeda"];

export default function CreateEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const navigate = useNavigate();
  const authenticated = useAuthenticated();

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_name: "",
      event_description: "",
      event_date: "",
      address: "",
      delivery_address: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await createEvent({
        event_name: data.event_name,
        event_description: data.event_description || "",
        event_date: data.event_date,
        address: data.address,
        delivery_address: data.delivery_address || data.address,
      });

      setEventId(result.event_id);
      setShowSuccessModal(true);
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-8 text-left">Event Details</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <FormInput
                  control={form.control}
                  name="event_name"
                  label="Event Name"
                  placeholder="Enter the event name"
                />
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">Event Type</label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("event_type", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <FormInput
                  control={form.control}
                  name="event_description"
                  label="Event Description"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">Event Date</label>
                  <div className="relative">
                    <FormInput
                      control={form.control}
                      name="event_date"
                      type="date"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <FormInput
                  control={form.control}
                  name="address"
                  label="Event Address"
                  placeholder="Enter event address"
                />
              </div>

              <div className="space-y-2 text-left">
                <FormInput
                  control={form.control}
                  name="delivery_address"
                  label="Delivery Address (optional)"
                  placeholder="Enter delivery address if different from event address"
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto px-8 bg-bluePrimary hover:bg-bluePrimary/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </Button>
            </form>
          </Form>
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