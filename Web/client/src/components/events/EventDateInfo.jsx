import React from "react";
import { Input } from "@/components/ui/input";

export function EventDateInfo({ formData, handleInputChange }) {
  return (
    <>
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
    </>
  );
}