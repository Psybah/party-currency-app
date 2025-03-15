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
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { USER_PROFILE_CONTEXT } from "@/context";
import { showSuccess, showError } from "@/utils/feedback";
import { handleAuthFeedback } from "@/utils/toastUtils";
import { formatErrorMessage } from "@/utils/errorUtils";
import { signupCelebrantApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";

// Signup form validation schema
const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .startsWith("+234", "Phone number must start with +234")
      .min(13, "Invalid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "+234",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const signupPromise = async () => {
        const response = await signupCelebrantApi(
          values.firstName,
          values.lastName,
          values.email,
          values.password,
          values.phoneNumber
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw errorData;
        }

        return response.json();
      };

      // Using handleAuthFeedback for signup operation
      const data = await handleAuthFeedback(signupPromise(), {
        loading: "Creating your account...",
        success: "Account created successfully! Redirecting...",
        error: "Signup failed",
        onSuccess: (data) => {
          // Handle successful signup
          const accessToken = data.token;
          storeAuth(accessToken, "customer", true);
          setUserProfile(data.user);

          // Show success and redirect
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500); // Short delay to show success message
        },
        onError: (error) => {
          // Handle field-specific errors
          const errorData = formatErrorMessage(error);

          // Map backend field errors to form fields
          const fieldMappings = {
            email: "email",
            first_name: "firstName",
            last_name: "lastName",
            password: "password",
            phone_number: "phoneNumber",
          };

          // Set form errors for each field with error
          Object.entries(errorData).forEach(([key, value]) => {
            const formField = fieldMappings[key];
            if (formField) {
              form.setError(formField, {
                type: "manual",
                message: Array.isArray(value) ? value[0] : value,
              });
            }
          });

          // Handle non-field errors
          if (errorData.detail && !Object.keys(form.formState.errors).length) {
            showError(errorData.detail);
          }
        },
      });
    } catch (error) {
      showError("Network error. Please check your connection and try again.");
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameInputs form={form} />

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          control={form.control}
        />

        <PasswordInputs
          form={form}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />

        <PhoneInput
          label="Phone number"
          name="phoneNumber"
          placeholder="8012345678"
          control={form.control}
        />

        <Button
          type="submit"
          className="bg-gold hover:bg-gold/90 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
