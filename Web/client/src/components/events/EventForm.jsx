import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, ChevronDown, ChevronUp } from "lucide-react";
import { LocationSelect } from "./LocationSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EventForm = ({ formData, handleInputChange, handleSubmit, isSubmitting }) => {
  const [showReconciliationInfo, setShowReconciliationInfo] = useState(false);
  const [customEventType, setCustomEventType] = useState("");

  const eventTypes = [
    "Birthday",
    "Wedding",
    "Anniversary",
    "Corporate Event",
    "Burial",
    "Other",
  ];

  const handleEventTypeChange = (value) => {
    handleInputChange({
      target: {
        name: "event_type",
        value,
      },
    });

    // Reset custom event type if not "Other"
    if (value !== "other") {
      setCustomEventType("");
    }
  };

  const handleCustomEventTypeChange = (e) => {
    setCustomEventType(e.target.value);
    handleInputChange({
      target: {
        name: "event_type",
        value: e.target.value,
      },
    });
  };

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
          <Select
            value={formData.event_type}
            onValueChange={handleEventTypeChange}
            required
          >
            <SelectTrigger className="w-full">
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

          {formData.event_type === "other" && (
            <div className="mt-2">
              <label className="text-sm font-medium text-left block">
                Specify Event Type
              </label>
              <Input
                required
                name="custom_event_type"
                value={customEventType}
                onChange={handleCustomEventTypeChange}
                placeholder="Enter custom event type"
              />
            </div>
          )}
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-left block">Post Code</label>
          <Input
            required
            name="post_code"
            value={formData.post_code}
            onChange={handleInputChange}
            placeholder="Enter post code"
          />
        </div>

        <LocationSelect
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>

      {/* Reconciliation Service Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {/* Reconciliation Service Toggle */}
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

          {/* Toggle Info Button */}
          <button
            type="button"
            onClick={() => setShowReconciliationInfo(!showReconciliationInfo)}
            className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
          >
            <span>{showReconciliationInfo ? "Hide Info" : "What is this?"}</span>
            {showReconciliationInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Reconciliation Info */}
        {showReconciliationInfo && (
          <div
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-500 ease-in-out"
          >
            <p className="text-sm text-gray-600 text-left">
              Party currency reconciliation service streamlines event management by providing
              foot soldiers to assist with currency transfers, a kiosk operator to convert party
              currency to real cash for guest artists, and an event wallet for hosts to monitor
              balances and transactions effortlessly, ensuring a stress-free experience with no
              risk of theft or fraud.
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
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
};
