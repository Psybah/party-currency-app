
import React from "react";
import { FormInput } from "./FormInput";

export function NameInputs({ form }) {
  return (
    <div className="gap-4 grid grid-cols-2">
      <FormInput
        label="First Name"
        name="firstName"
        placeholder="John"
        control={form.control}
        labelClassName="text-left"
      />
      <FormInput
        label="Last Name"
        name="lastName"
        placeholder="Doe"
        control={form.control}
        labelClassName="text-left"
      />
    </div>
  );
}
