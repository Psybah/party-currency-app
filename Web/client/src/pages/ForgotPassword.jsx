import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthFormWrapper } from "@/components/forms/AuthFormWrapper";
import { Loader } from "lucide-react";
import {
  requestPasswordResetCode,
  getPasswordResetToken,
  resetPassword,
} from "@/api/authApi";
import { showSuccess, showError, withFeedback } from "@/utils/feedback";
import { formatErrorMessages } from "@/utils/feedback";
import { BASE_URL } from "@/config";
// Validation schemas
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const codeSchema = z.object({
  code: z.string().min(4, "Please enter the verification code"),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleRequestCode = async (values) => {
    try {
      await withFeedback(
        async () => {
          const response = await fetch(`${BASE_URL}/auth/password/code`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: values.email
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
          }

          setEmail(values.email);
          setStep(2);
          return response.json();
        },
        {
          loadingMessage: "Sending verification code...",
          successMessage: "Verification code sent to your email!",
        }
      );
    } catch (error) {
      const errorMessage = formatErrorMessages(error);

      if (error.email) {
        emailForm.setError("email", {
          type: "manual",
          message: Array.isArray(error.email) ? error.email[0] : error.email,
        });
      } else {
        showError(
          errorMessage || "Failed to send verification code. Please try again."
        );
      }

      console.error("Request code error:", error);
    }
  };

  const handleVerifyCode = async (values) => {
    try {
      await withFeedback(
        async () => {
          const tokenResponse = await fetch(`${BASE_URL}/auth/password/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email
            }),
          });

          if (!tokenResponse.ok) {
            throw await tokenResponse.json();
          }

          const { token } = await tokenResponse.json();
          localStorage.setItem('resetToken', token);
          setStep(3);
          return { success: true };
        },
        {
          loadingMessage: "Verifying code...",
          successMessage: "Code verified successfully!",
        }
      );
    } catch (error) {
      const errorMessage = formatErrorMessages(error);

      if (error.code) {
        codeForm.setError("code", {
          type: "manual",
          message: Array.isArray(error.code) ? error.code[0] : error.code,
        });
      } else {
        showError(
          errorMessage || "Invalid verification code. Please try again."
        );
      }

      console.error("Verify code error:", error);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      await withFeedback(
        async () => {
          const resetToken = localStorage.getItem('resetToken');
          const response = await fetch(`${BASE_URL}/auth/password/reset`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${resetToken}`,
            },
            body: JSON.stringify({
              email: email,
              password: values.password
            }),
          });

          if (!response.ok) {
            throw await response.json();
          }

          localStorage.removeItem('resetToken');
          setTimeout(() => (window.location.href = "/login"), 2000);
          return response.json();
        },
        {
          loadingMessage: "Resetting your password...",
          successMessage: "Password reset successfully! Please login with your new password.",
        }
      );
    } catch (error) {
      const errorMessage = formatErrorMessages(error);

      if (error.password) {
        passwordForm.setError("password", {
          type: "manual",
          message: Array.isArray(error.password)
            ? error.password[0]
            : error.password,
        });
      } else if (error.confirmPassword) {
        passwordForm.setError("confirmPassword", {
          type: "manual",
          message: Array.isArray(error.confirmPassword)
            ? error.confirmPassword[0]
            : error.confirmPassword,
        });
      } else {
        showError(
          errorMessage || "Failed to reset password. Please try again."
        );
      }

      console.error("Reset password error:", error);
    }
  };

  return (
    <AuthFormWrapper
      title="Reset Password"
      subtitle={
        step === 1
          ? "Enter your email to receive a verification code"
          : step === 2
          ? "Enter the verification code sent to your email"
          : "Create your new password"
      }
    >
      <div className="space-y-6">
        {step === 1 && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleRequestCode)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-left block">Email</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@gmail.com"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting ? (
                  <>
                    <Loader className="mr-2 w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send verification code"
                )}
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...codeForm}>
            <form
              onSubmit={codeForm.handleSubmit(handleVerifyCode)}
              className="space-y-4"
            >
              <FormField
                control={codeForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <Input {...field} placeholder="Enter verification code" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full"
                  disabled={codeForm.formState.isSubmitting}
                >
                  {codeForm.formState.isSubmitting ? (
                    <>
                      <Loader className="mr-2 w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-500 text-xs hover:text-gray-700"
                  onClick={() => setStep(1)}
                  disabled={codeForm.formState.isSubmitting}
                >
                  Use a different email
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-500 text-xs"
                  onClick={() =>
                    emailForm.handleSubmit(handleRequestCode)({ email })
                  }
                  disabled={codeForm.formState.isSubmitting}
                >
                  Resend code
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm new password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? (
                  <>
                    <Loader className="mr-2 w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="text-muted-foreground text-sm hover:underline"
          >
            Back to sign in page
          </Link>
        </div>
      </div>
    </AuthFormWrapper>
  );
}
