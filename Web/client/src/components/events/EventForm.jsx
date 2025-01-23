import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { LocationSelect } from "./LocationSelect";

export function EventForm({ formData, handleInputChange, handleSubmit, isSubmitting }) {
  const eventTypes = [
    "Birthday",
    "Wedding",
    "Anniversary",
    "Corporate Event",
    "Burial",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-left block">Event Name</label>
          <Input
            required
            name="event_name"
            value={formData.event_name}
            onChange={handleInputChange}
            minLength={3}
            maxLength={100}
            placeholder="Enter event name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-left block">Event Type</label>
          <select
            required
            name="event_type"
            value={formData.event_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select event type</option>
            {eventTypes.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-left block">Start Date</label>
          <Input
            required
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-left block">End Date</label>
          <Input
            required
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            min={formData.start_date || new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-left block">Street Address</label>
          <Input
            required
            name="street_address"
            value={formData.street_address}
            onChange={handleInputChange}
            placeholder="Enter street address"
          />
        </div>

        <LocationSelect
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="reconciliation_service"
          name="reconciliation_service"
          checked={formData.reconciliation_service}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-600"
        />
        <label htmlFor="reconciliation_service" className="text-sm font-medium text-left">
          Enable Reconciliation Service
        </label>
      </div>

      <Button
        type="submit"
        className="w-full md:w-auto px-8 bg-gold hover:bg-gold/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Creating Event...
          </>
        ) : (
          "Create Event"
        )}
      </Button>
    </form>
  );
}