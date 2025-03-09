import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { merchantSignupSchema } from "@/lib/validations/auth";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { NameInputs } from "@/components/forms/NameInputs";
import { PasswordInputs } from "@/components/forms/PasswordInputs";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { BusinessInfoInputs } from "@/components/merchant/BusinessInfoInputs";
import { SignupSubmitButton } from "@/components/forms/SignupSubmitButton";
import { SocialAuthButtons } from "@/components/forms/SocialAuthButtons";
import { TermsAndConditions } from "@/components/forms/TermsAndConditions";
import { signupMerchantApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";
import { USER_PROFILE_CONTEXT } from "@/context";
import { formatErrorMessage } from "@/utils/errorUtils";
import { toast } from "react-hot-toast";
import {
  showAuthSuccess,
  showAuthError,
  showValidationError,
} from "@/utils/feedback";

export function MerchantSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);

  const form = useForm({
    resolver: zodResolver(merchantSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessType: "",
      country: "Nigeria",
      state: "",
      city: "",
      phoneNumber: "+234",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    // Clear any existing errors before submission
    form.clearErrors();

    try {
      const response = await signupMerchantApi(values);
      const data = await response.json();

      if (response.ok) {
        showAuthSuccess("Merchant account created successfully!");
        console.log("Merchant signup successful:", data);
        const accessToken = data.token;
        storeAuth(accessToken, "merchant", true);
        setUserProfile(
          data.user || {
            firstname: values.firstName,
            lastname: values.lastName,
            email: values.email,
          }
        );
        navigate("/merchant/transactions");
      } else {
        const errorData = formatErrorMessage(data);
        console.log("API Error response:", errorData);

        // Debug the structure of the error data
        console.log(
          "Error data structure:",
          JSON.stringify(errorData, null, 2)
        );

        let hasSetError = false;

        // Specifically handle the structure we're seeing in the logs
        if (errorData.error) {
          // Handle email errors
          if (errorData.error.email) {
            const emailError = Array.isArray(errorData.error.email)
              ? errorData.error.email[0]
              : errorData.error.email;

            console.log("Setting email error:", emailError);
            // Use setState instead of form.setError to guarantee update
            setServerErrors((prev) => ({ ...prev, email: emailError }));

            // Still set in form for validation purposes
            form.setError("email", {
              type: "manual",
              message: emailError,
            });
            hasSetError = true;
          }

          // Similarly handle other potential errors
          if (errorData.error.phone_number) {
            const phoneError = Array.isArray(errorData.error.phone_number)
              ? errorData.error.phone_number[0]
              : errorData.error.phone_number;

            console.log("Setting phone error:", phoneError);
            setServerErrors((prev) => ({ ...prev, phoneNumber: phoneError }));

            form.setError("phoneNumber", {
              type: "manual",
              message: phoneError,
            });
            hasSetError = true;
          }

          if (errorData.error.password) {
            const passwordError = Array.isArray(errorData.error.password)
              ? errorData.error.password[0]
              : errorData.error.password;

            console.log("Setting password error:", passwordError);
            setServerErrors((prev) => ({ ...prev, password: passwordError }));

            form.setError("password", {
              type: "manual",
              message: passwordError,
            });
            hasSetError = true;
          }
        }

        // After setting errors, log the form state to verify errors are set
        console.log("Form errors after setting:", form.formState.errors);

        // Force a re-render to ensure errors are displayed
        setForceUpdate((prev) => prev + 1);

        // Show toast messages
        if (hasSetError) {
          showValidationError("Please check your form entries and try again");
        } else if (errorData.message) {
          showAuthError(
            typeof errorData.message === "string"
              ? errorData.message
              : "Signup failed. Please check your information and try again."
          );
        }
      }
    } catch (error) {
      showAuthError(
        "Network error occurred. Please check your connection and try again."
      );
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to monitor form errors for debugging
  React.useEffect(() => {
    console.log("Current form errors:", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <NameInputs form={form} />

          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            control={form.control}
            labelClassName="text-left"
            error={form.formState.errors.email?.message || serverErrors.email}
          />

          <PasswordInputs
            form={form}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            error={
              form.formState.errors.password?.message || serverErrors.password
            }
          />

          <BusinessInfoInputs form={form} />

          <PhoneInput
            label="Phone number"
            name="phoneNumber"
            placeholder="8012345678"
            control={form.control}
            error={
              form.formState.errors.phoneNumber?.message ||
              serverErrors.phoneNumber
            }
          />

          <SignupSubmitButton loading={loading} />
        </form>
      </Form>

      {/* Make debug error display more prominent during development */}
      {(Object.keys(form.formState.errors).length > 0 ||
        Object.keys(serverErrors).length > 0) && (
        <div className="bg-red-50 mt-4 p-3 border border-red-300 rounded text-red-600">
          <h4 className="font-bold">Form Validation Errors:</h4>
          {Object.entries(form.formState.errors).map(([key, error]) => (
            <p key={`form-${key}`}>
              <strong>{key}</strong>: {error.message}
            </p>
          ))}
          {/* {Object.entries(serverErrors).map(([key, error]) => (
            <p key={`server-${key}`}>
              <strong>{key} (server)</strong>: {error}
            </p>
          ))} */}
        </div>
      )}

      <SocialAuthButtons />
      <TermsAndConditions />
    </>
  );
}
