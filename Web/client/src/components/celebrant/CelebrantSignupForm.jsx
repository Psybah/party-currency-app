import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { NameInputs } from "@/components/forms/NameInputs";
import { PasswordInputs } from "@/components/forms/PasswordInputs";
import { SignupSubmitButton } from "@/components/forms/SignupSubmitButton";
import { TermsAndConditions } from "@/components/forms/TermsAndConditions";
import { SocialAuthButtons } from "@/components/forms/SocialAuthButtons";
import { signupCelebrantApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";
import { USER_PROFILE_CONTEXT } from "@/context";
import { formatErrorMessage } from "@/utils/errorUtils";
import {
  showAuthSuccess,
  showAuthError,
  showValidationError,
} from "@/utils/feedback";

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    phone: z
      .string()
      .startsWith("+234", "Phone number must start with +234")
      .min(13, "Invalid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function CelebrantSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "+234",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    // Clear any existing errors before submission
    form.clearErrors();
    setServerErrors({});
    console.log(values);
    try {
      const { firstName, lastName, email, password, phone } = values;
      const response = await signupCelebrantApi(
        firstName,
        lastName,
        email,
        password,
        phone
      );
      const data = await response.json();

      if (response.ok) {
        showAuthSuccess(
          "Account created successfully! Welcome to Party Currency."
        );
        setUserProfile(data.user);
        const accessToken = data.token;
        storeAuth(accessToken, "customer", true);
        navigate("/dashboard");
      } else {
        const errorData = formatErrorMessage(data);
        console.log("API Error response:", errorData);
        console.log(
          "Error data structure:",
          JSON.stringify(errorData, null, 2)
        );

        let hasSetError = false;

        // Handle errors based on the API response structure
        if (errorData.error) {
          // Handle email errors
          if (errorData.error.email) {
            const emailError = Array.isArray(errorData.error.email)
              ? errorData.error.email[0]
              : errorData.error.email;

            console.log("Setting email error:", emailError);
            setServerErrors((prev) => ({ ...prev, email: emailError }));
            form.setError("email", {
              type: "manual",
              message: emailError,
            });
            hasSetError = true;
          }

          // Handle phone errors (matching field name in this form)
          if (errorData.error.phone || errorData.error.phone_number) {
            const phoneError = Array.isArray(errorData.error.phone)
              ? errorData.error.phone[0]
              : errorData.error.phone || errorData.error.phone_number;

            console.log("Setting phone error:", phoneError);
            setServerErrors((prev) => ({ ...prev, phone: phoneError }));
            form.setError("phone", {
              type: "manual",
              message: phoneError,
            });
            hasSetError = true;
          }

          // Handle password errors
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
        } else if (errorData.email || errorData.phone || errorData.password) {
          // Direct error fields on the root level
          if (errorData.email) {
            const emailError = Array.isArray(errorData.email)
              ? errorData.email[0]
              : errorData.email;
            setServerErrors((prev) => ({ ...prev, email: emailError }));
            form.setError("email", { type: "manual", message: emailError });
            hasSetError = true;
          }

          if (errorData.phone || errorData.phone_number) {
            const phoneError = errorData.phone || errorData.phone_number;
            const errorMessage = Array.isArray(phoneError)
              ? phoneError[0]
              : phoneError;
            setServerErrors((prev) => ({ ...prev, phone: errorMessage }));
            form.setError("phone", { type: "manual", message: errorMessage });
            hasSetError = true;
          }

          if (errorData.password) {
            const passwordError = Array.isArray(errorData.password)
              ? errorData.password[0]
              : errorData.password;
            setServerErrors((prev) => ({ ...prev, password: passwordError }));
            form.setError("password", {
              type: "manual",
              message: passwordError,
            });
            hasSetError = true;
          }
        }

        // Handle detail message that might contain email error
        if (
          errorData.detail &&
          errorData.detail.toLowerCase().includes("email")
        ) {
          setServerErrors((prev) => ({ ...prev, email: errorData.detail }));
          form.setError("email", {
            type: "manual",
            message: errorData.detail,
          });
          hasSetError = true;
        }

        // After setting errors, log the form state to verify errors are set
        console.log("Form errors after setting:", form.formState.errors);
        setForceUpdate((prev) => prev + 1);

        if (hasSetError) {
          showValidationError("Please check your form entries and try again");
        } else {
          showAuthError(
            typeof errorData.message === "string"
              ? errorData.message
              : "Signup failed. Please check your information and try again."
          );
        }
      }
    } catch (error) {
      showAuthError("Network error occurred. Please try again later.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debug form errors
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

          <PhoneInput
            label="Phone number"
            name="phone"
            placeholder="8012345678"
            control={form.control}
            error={form.formState.errors.phone?.message || serverErrors.phone}
          />

          <SignupSubmitButton loading={loading} />
        </form>
      </Form>

      <SocialAuthButtons />
      <TermsAndConditions />
    </>
  );
}
