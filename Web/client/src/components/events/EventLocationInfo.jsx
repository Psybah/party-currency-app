import React from "react";
import { Input } from "@/components/ui/input";
import { LocationSelect } from "./LocationSelect";

export function EventLocationInfo({ formData, handleInputChange }) {
  return (
    <>
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
        <label className="text-sm font-medium text-left block">Postal Code</label>
        <Input
          required
          name="postal_code"
          value={formData.postal_code}
          onChange={handleInputChange}
          placeholder="Enter postal code"
        />
      </div>

      <LocationSelect
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </>
  );
}