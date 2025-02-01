import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EventBasicInfo({ formData, handleInputChange, customEventType, setCustomEventType }) {
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
        value: value.toLowerCase(),
      },
    });

    if (value.toLowerCase() !== "other") {
      setCustomEventType("");
    }
  };

  const handleCustomEventTypeChange = (e) => {
    const value = e.target.value;
    setCustomEventType(value);
  };

  return (
    <>
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
              <SelectItem key={type.toLowerCase()} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {formData.event_type === "other" && (
          <div className="mt-2">
            <Input
              required
              name="custom_event_type"
              value={customEventType}
              onChange={handleCustomEventTypeChange}
              placeholder="Enter custom event type"
              className="mt-2"
            />
          </div>
        )}
      </div>
    </>
  );
}