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
import { TermsAndConditions } from "@/components/forms/TermsAndConditions";
import { signupMerchantApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";
import { USER_PROFILE_CONTEXT } from "@/context";
import { formatErrorMessage } from "@/utils/errorUtils";
import {
  showAuthSuccess,
  showAuthError,
  showValidationError,
} from "@/utils/feedback";

const nameRegex = /^[a-zA-Z0-9@]+$/; // Allow letters, numbers, and @ symbol

export function MerchantSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState({});

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
    form.clearErrors();
    setServerErrors({});

    // Validate name fields first
    if (!nameRegex.test(values.firstName)) {
      form.setError("firstName", {
        type: "manual",
        message: "First name can only contain letters, numbers, and @",
      });
      showValidationError("Please check your form entries and try again");
      setLoading(false);
      return;
    }

    if (!nameRegex.test(values.lastName)) {
      form.setError("lastName", {
        type: "manual",
        message: "Last name can only contain letters, numbers, and @",
      });
      showValidationError("Please check your form entries and try again");
      setLoading(false);
      return;
    }

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

        let hasSetError = false;

        if (errorData.error) {
          // Handle first name errors
          if (errorData.error.firstName || errorData.error.first_name) {
            const firstNameError = errorData.error.firstName || errorData.error.first_name;
            setServerErrors((prev) => ({
              ...prev,
              firstName: Array.isArray(firstNameError) ? firstNameError[0] : firstNameError,
            }));
            form.setError("firstName", {
              type: "manual",
              message: Array.isArray(firstNameError) ? firstNameError[0] : firstNameError,
            });
            hasSetError = true;
          }

          // Handle last name errors
          if (errorData.error.lastName || errorData.error.last_name) {
            const lastNameError = errorData.error.lastName || errorData.error.last_name;
            setServerErrors((prev) => ({
              ...prev,
              lastName: Array.isArray(lastNameError) ? lastNameError[0] : lastNameError,
            }));
            form.setError("lastName", {
              type: "manual",
              message: Array.isArray(lastNameError) ? lastNameError[0] : lastNameError,
            });
            hasSetError = true;
          }

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

        // Show toast messages
        if (hasSetError) {
          showValidationError("Signup failed. Please check your information and try again.");
        }
      }
    } catch (error) {
      showAuthError("Network error occurred. Please check your connection and try again.");
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
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-center mb-6">
        Create a Merchant Account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <NameInputs 
            form={form} 
            firstNameError={serverErrors.firstName}
            lastNameError={serverErrors.lastName}
          />

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

      <TermsAndConditions />
    </>
  );
}
