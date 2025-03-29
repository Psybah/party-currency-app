import React from "react";
import { FormInput } from "@/components/forms/FormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BusinessInfoInputs({ form }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="businessType"
          className="block font-medium text-gray-700 text-sm text-left"
        >
          Business Type
        </label>
        <Select
          onValueChange={(value) => form.setValue("businessType", value)}
          defaultValue={form.getValues("businessType")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kiosk">Kiosk operator</SelectItem>
            <SelectItem value="foot-soldier">Foot soldier</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.businessType && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.businessType.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="country"
          className="block font-medium text-gray-700 text-sm text-left"
        >
          Country
        </label>
        <input
          type="text"
          id="country"
          value="Nigeria"
          disabled
          className="bg-gray-50 px-3 py-2 border border-gray-300 rounded-md w-full text-gray-600"
        />
      </div>

      <div className="gap-4 grid grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="state"
            className="block font-medium text-gray-700 text-sm text-left"
          >
            State
          </label>
          <FormInput name="state" control={form.control} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="city"
            className="block font-medium text-gray-700 text-sm text-left"
          >
            City
          </label>
          <FormInput
            name="city"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ikeja">Ikeja</SelectItem>
                  <SelectItem value="lekki">Lekki</SelectItem>
                  <SelectItem value="vi">Victoria Island</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
