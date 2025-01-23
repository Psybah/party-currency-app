import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

const fetchStates = async () => {
  try {
    const response = await fetch("https://nga-states-lga.onrender.com/fetch");
    if (!response.ok) {
      throw new Error("Failed to fetch states");
    }
    const data = await response.json();
    return data.states;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw new Error("Unable to load states. Please try again later.");
  }
};

const fetchLGAs = async (state) => {
  if (!state) return [];
  try {
    const response = await fetch(`https://nga-states-lga.onrender.com/?state=${state}`);
    if (!response.ok) {
      throw new Error("Failed to fetch LGAs");
    }
    const data = await response.json();
    return data.lga;
  } catch (error) {
    console.error("Error fetching LGAs:", error);
    throw new Error("Unable to load LGAs. Please try again later.");
  }
};

export function LocationSelect({ formData, handleInputChange }) {
  const {
    data: states,
    isLoading: statesLoading,
    error: statesError
  } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const {
    data: lgas,
    isLoading: lgasLoading,
    error: lgasError
  } = useQuery({
    queryKey: ["lgas", formData.state],
    queryFn: () => fetchLGAs(formData.state),
    enabled: !!formData.state,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleStateChange = (value) => {
    handleInputChange({
      target: {
        name: "state",
        value
      }
    });
    handleInputChange({
      target: {
        name: "lga",
        value: ""
      }
    });
  };

  const handleLGAChange = (value) => {
    handleInputChange({
      target: {
        name: "lga",
        value
      }
    });
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-left block">State</label>
        <Select
          value={formData.state}
          onValueChange={handleStateChange}
          disabled={statesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={statesLoading ? "Loading states..." : "Select state"} />
          </SelectTrigger>
          <SelectContent>
            {states?.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-left block">City</label>
        <Input
          name="city"
          value={formData.city || ""}
          onChange={handleInputChange}
          placeholder="Enter city name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-left block">LGA</label>
        <Select
          value={formData.lga}
          onValueChange={handleLGAChange}
          disabled={!formData.state || lgasLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              !formData.state
                ? "Select a state first"
                : lgasLoading
                  ? "Loading LGAs..."
                  : "Select LGA"
            } />
          </SelectTrigger>
          <SelectContent>
            {lgas?.map((lga) => (
              <SelectItem key={lga} value={lga}>
                {lga}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}