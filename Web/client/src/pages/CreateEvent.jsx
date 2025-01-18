import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthenticated } from "@/lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { createEventApi } from "@/api/eventApi";

export default function CreateEvent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const authenticated = useAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await createEventApi(data);
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const result = await response.json();
      toast.success(`Event created successfully! Event ID: ${result.event_id}`);
      navigate("/templates");
    } catch (err) {
      toast.error(err.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="min-h-screen bg-gradientWhite1">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="md:pl-64">
        <DashboardHeader toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        <main className="p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h1 className="text-2xl font-playfair font-semibold text-bluePrimary mb-8 text-left">
                Event Details
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    Event Name
                  </label>
                  <Input
                    {...register("event_name", { required: "Event name is required" })}
                    placeholder="Enter the event name"
                    className="w-full border-lightgray"
                  />
                  {errors.event_name && (
                    <p className="text-red-500 text-sm text-left">{errors.event_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    Event Type
                  </label>
                  <Select {...register("event_type", { required: "Event type is required" })}>
                    <SelectTrigger className="w-full border-lightgray">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.event_type && (
                    <p className="text-red-500 text-sm text-left">{errors.event_type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    Event Starting Date
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      {...register("start_date", { required: "Start date is required" })}
                      className="w-full border-lightgray pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-blueSecondary pointer-events-none" />
                  </div>
                  {errors.start_date && (
                    <p className="text-red-500 text-sm text-left">{errors.start_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    Event Ending Date
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      {...register("end_date", { required: "End date is required" })}
                      className="w-full border-lightgray pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-blueSecondary pointer-events-none" />
                  </div>
                  {errors.end_date && (
                    <p className="text-red-500 text-sm text-left">{errors.end_date.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-bluePrimary text-left">
                  Street Address
                </label>
                <Input
                  {...register("street_address", { required: "Street address is required" })}
                  placeholder="Enter street address"
                  className="w-full border-lightgray"
                />
                {errors.street_address && (
                  <p className="text-red-500 text-sm text-left">{errors.street_address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    Post Code
                  </label>
                  <Input
                    {...register("post_code", { required: "Post code is required" })}
                    placeholder="Enter post code"
                    className="w-full border-lightgray"
                  />
                  {errors.post_code && (
                    <p className="text-red-500 text-sm text-left">{errors.post_code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    City
                  </label>
                  <Select {...register("city", { required: "City is required" })}>
                    <SelectTrigger className="w-full border-lightgray">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-red-500 text-sm text-left">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    Country
                  </label>
                  <Select {...register("country", { required: "Country is required" })}>
                    <SelectTrigger className="w-full border-lightgray">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nigeria">Nigeria</SelectItem>
                      <SelectItem value="ghana">Ghana</SelectItem>
                      <SelectItem value="kenya">Kenya</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-sm text-left">{errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bluePrimary text-left">
                    LGA
                  </label>
                  <Select {...register("lga", { required: "LGA is required" })}>
                    <SelectTrigger className="w-full border-lightgray">
                      <SelectValue placeholder="Select LGA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ikeja">Ikeja</SelectItem>
                      <SelectItem value="lekki">Lekki</SelectItem>
                      <SelectItem value="victoria-island">Victoria Island</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.lga && (
                    <p className="text-red-500 text-sm text-left">{errors.lga.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-bluePrimary text-left">
                  Reconciliation Service
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register("reconciliation_service")}
                      value="true"
                      className="text-gold focus:ring-gold"
                    />
                    <span className="text-sm text-gray-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register("reconciliation_service")}
                      value="false"
                      className="text-gold focus:ring-gold"
                    />
                    <span className="text-sm text-gray-600">No</span>
                  </label>
                </div>
                {errors.reconciliation_service && (
                  <p className="text-red-500 text-sm text-left">
                    {errors.reconciliation_service.message}
                  </p>
                )}
              </div>

                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold hover:bg-gold/90 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating Event..." : "Create Event"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
