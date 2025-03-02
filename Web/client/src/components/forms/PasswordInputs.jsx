
import React from "react";
import { FormInput } from "./FormInput";

export function PasswordInputs({ form, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) {
  return (
    <>
      <FormInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        control={form.control}
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        labelClassName="text-left"
      />

      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Confirm your password"
        control={form.control}
        showPasswordToggle
        showPassword={showConfirmPassword}
        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        labelClassName="text-left"
      />
    </>
  );
}
