import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AuthFormWrapper } from "@/components/forms/AuthFormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { SocialAuthButtons } from "@/components/forms/SocialAuthButtons";
import { signupCelebrantApi, getProfileApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";
import { USER_PROFILE_CONTEXT } from "@/context";

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Invalid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function CelebrantSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await signupCelebrantApi(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
        values.phone
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message = JSON.stringify(Object.values(errorData)[0]);
        form.setError("root", { message });
        return;
      }

      const responseData = await response.json();
      const accessToken = responseData.token;
      storeAuth(accessToken, "customer", true);

      const userProfileResponse = await getProfileApi();
      if (userProfileResponse.ok) {
        const userProfileData = await userProfileResponse.json();
        setUserProfile(userProfileData);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      form.setError("root", {
        message: "An error occurred during signup. Please try again.",
      });
    }
  };

  return (
    <AuthFormWrapper
      title="Sign up as Host/Event planner"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkPath="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="gap-4 grid grid-cols-2">
            <FormInput
              label="First Name"
              name="firstName"
              placeholder="John"
              control={form.control}
            />
            <FormInput
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              control={form.control}
            />
          </div>

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
            placeholder="Enter your password"
            control={form.control}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            control={form.control}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <FormInput
            label="Phone number"
            name="phone"
            type="tel"
            placeholder="+234..."
            control={form.control}
          />

          {form.formState.errors.root && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="bg-footer hover:bg-[#2D2D2D] w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating account..."
              : "Create an account"}
          </Button>
        </form>
      </Form>

      <SocialAuthButtons />

      <div className="text-center text-sm">
        By clicking "Create an Account" above, you acknowledge that you have
        read, understood, and agree to Party Currency's{" "}
        <a href="/terms" className="text-gold hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-gold hover:underline">
          Privacy Policy
        </a>
        .
      </div>
    </AuthFormWrapper>
  );
}
