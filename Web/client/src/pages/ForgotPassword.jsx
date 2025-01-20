import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { AuthFormWrapper } from "@/components/forms/AuthFormWrapper";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { requestPasswordResetCode, getPasswordResetToken, resetPassword } from "@/api/passwordApi";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const codeSchema = z.object({
  code: z.string().min(4, "Please enter the verification code"),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
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
    setLoading(true);
    try {
      const response = await requestPasswordResetCode(values.email);
      const data = await response.json();

      if (response.ok) {
        setEmail(values.email);
        setStep(2);
        toast.success("Verification code sent to your email!");
      } else {
        throw new Error(data.message || "Failed to send verification code");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (values) => {
    setLoading(true);
    try {
      const response = await getPasswordResetToken(email);
      const data = await response.json();

      if (response.ok) {
        setStep(3);
        toast.success("Code verified successfully!");
      } else {
        throw new Error(data.message || "Invalid verification code");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const response = await resetPassword(email, values.password);
      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully! Please login with your new password.");
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
            <form onSubmit={emailForm.handleSubmit(handleRequestCode)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type="email" placeholder="example@gmail.com" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D]"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send verification code"}
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...codeForm}>
            <form onSubmit={codeForm.handleSubmit(handleVerifyCode)} className="space-y-4">
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
              <Button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D]"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <Input {...field} type="password" placeholder="Enter new password" />
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
                    <Input {...field} type="password" placeholder="Confirm new password" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D]"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <GoogleAuthButton />

        <div className="text-center">
          <Link to="/login" className="text-sm text-muted-foreground hover:underline">
            Back to sign in page
          </Link>
        </div>
      </div>
    </AuthFormWrapper>
  );
}