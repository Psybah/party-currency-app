import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { USER_PROFILE_CONTEXT } from "@/context";
import { showSuccess, showError } from "@/utils/feedback";
import { handleAuthFeedback } from "@/utils/toastUtils";
import { formatErrorMessage } from "@/utils/errorUtils";
import { loginUserApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";
import { Eye, EyeOff, Loader } from "lucide-react";

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Using handleAuthFeedback for login operation
      const response = await handleAuthFeedback(
        loginUserApi(values.email, values.password),
        {
          loading: "Logging in...",
          success: "Login successful! Redirecting...",
          error: "Login failed",
          onSuccess: (data) => {
            // Handle successful login
            const accessToken = data.token;
            storeAuth(accessToken, data.user_type || "customer", true);
            setUserProfile(data.user);

            // Redirect based on user type
            setTimeout(() => {
              const redirectPath =
                data.user_type === "merchant"
                  ? "/merchant/dashboard"
                  : "/dashboard";
              navigate(redirectPath);
            }, 1000); // Short delay to show success message
          },
          onError: (error) => {
            // Handle field-specific errors
            const errorData = formatErrorMessage(error);

            if (errorData.email) {
              form.setError("email", {
                type: "manual",
                message: Array.isArray(errorData.email)
                  ? errorData.email[0]
                  : errorData.email,
              });
            }

            if (errorData.password) {
              form.setError("password", {
                type: "manual",
                message: Array.isArray(errorData.password)
                  ? errorData.password[0]
                  : errorData.password,
              });
            }

            // Handle other errors or non-field errors
            if (errorData.detail) {
              showError(errorData.detail);
            }
          },
        }
      );
    } catch (error) {
      // This should rarely be reached since handleAuthFeedback catches errors
      showError("Network error. Please check your connection and try again.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          control={form.control}
        />

        <FormInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          control={form.control}
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <Button
          type="submit"
          className="bg-bluePrimary hover:bg-bluePrimary/90 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
