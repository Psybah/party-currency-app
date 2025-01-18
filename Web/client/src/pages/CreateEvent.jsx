import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { eventSchema } from "@/lib/validations/event";
import { useAuthenticated } from "@/lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";

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

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      event_type: "",
      start_date: "",
      end_date: "",
      street_address: "",
      post_code: "",
      city: "",
      country: "",
      lga: "",
      reconciliation_service: false,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(data),
      });

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
                  name="first_name"
                  label="First Name"
                  placeholder="Enter your first name"
                  className="max-w-sm"
                />
                <FormInput
                  control={form.control}
                  name="last_name"
                  label="Last Name"
                  placeholder="Enter your last name"
                  className="max-w-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="example@gmail.com"
                  className="max-w-sm"
                />
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">Event Type</label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("event_type", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="max-w-sm">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">Event Starting Date</label>
                  <div className="relative max-w-sm">
                    <FormInput
                      control={form.control}
                      name="start_date"
                      type="date"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">Event Ending Date</label>
                  <div className="relative max-w-sm">
                    <FormInput
                      control={form.control}
                      name="end_date"
                      type="date"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <FormInput
                  control={form.control}
                  name="street_address"
                  label="Street Address"
                  placeholder="Enter street address"
                  className="max-w-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <FormInput
                  control={form.control}
                  name="post_code"
                  label="Post Code"
                  placeholder="Enter post code"
                  className="max-w-sm"
                />
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">City</label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("city", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city.toLowerCase()}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">Country</label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("country", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country.toLowerCase()}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium">LGA</label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("lga", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Select LGA" />
                    </SelectTrigger>
                    <SelectContent>
                      {lgas.map((lga) => (
                        <SelectItem key={lga} value={lga.toLowerCase()}>
                          {lga}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium">
                  Reconciliation Service
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reconciliation_service"
                      value="yes"
                      onChange={() =>
                        form.setValue("reconciliation_service", true, {
                          shouldValidate: true,
                        })
                      }
                      className="form-radio"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reconciliation_service"
                      value="no"
                      onChange={() =>
                        form.setValue("reconciliation_service", false, {
                          shouldValidate: true,
                        })
                      }
                      className="form-radio"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full md:w-auto px-8 bg-gold hover:bg-gold/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </Button>
            </form>
          </Form>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-600">
                Event Created Successfully!
              </h2>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Below is your unique Event ID. You can copy it for future reference.
            </p>
            <div className="bg-gray-100 p-3 rounded mb-4 text-center">
              <code>{eventId}</code>
            </div>
            <Button
              className="w-full bg-blueSecondary hover:bg-blueSecondary/90 text-white"
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
