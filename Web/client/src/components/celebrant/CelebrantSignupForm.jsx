
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
import { toast } from "react-hot-toast";

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().startsWith("+234", "Phone number must start with +234").min(13, "Invalid phone number"),
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

    try {
      const response = await signupCelebrantApi(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
        values.phone
      );

      const data = await response.json();

      if (response.ok) {
        const accessToken = data.token;
        storeAuth(accessToken, "customer", true);
        setUserProfile(data.user);
        navigate("/dashboard");
      } else {
        const errorData = formatErrorMessage(data);
        console.log("API Error response:", errorData);
        
        // Handle email-specific errors, whether they're in email field or detail field
        if (errorData.email) {
          form.setError("email", { 
            type: "manual", 
            message: Array.isArray(errorData.email) ? errorData.email[0] : errorData.email 
          });
        } else if (errorData.detail && errorData.detail.toLowerCase().includes("email")) {
          form.setError("email", { 
            type: "manual", 
            message: errorData.detail 
          });
        }
        
        // Handle other field-specific errors
        if (errorData.phone_number) {
          form.setError("phone", { 
            type: "manual", 
            message: Array.isArray(errorData.phone_number) ? errorData.phone_number[0] : errorData.phone_number 
          });
        }
        if (errorData.password) {
          form.setError("password", { 
            type: "manual", 
            message: Array.isArray(errorData.password) ? errorData.password[0] : errorData.password 
          });
        }
        if (errorData.first_name) {
          form.setError("firstName", { 
            type: "manual", 
            message: Array.isArray(errorData.first_name) ? errorData.first_name[0] : errorData.first_name 
          });
        }
        if (errorData.last_name) {
          form.setError("lastName", { 
            type: "manual", 
            message: Array.isArray(errorData.last_name) ? errorData.last_name[0] : errorData.last_name 
          });
        }
        
        // Show generic toast error only if we couldn't map any specific field errors
        const hasSetFieldErrors = Object.keys(form.formState.errors).length > 0;
        if (!hasSetFieldErrors && errorData.message) {
          toast.error(typeof errorData.message === 'string' ? errorData.message : "Signup failed. Please check your information and try again.");
        }
      }
    } catch (error) {
      toast.error("Network error occurred. Please check your connection and try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

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
            name="phone"
            placeholder="8012345678"
            control={form.control}
          />

          <SignupSubmitButton loading={loading} />
        </form>
      </Form>

      <SocialAuthButtons />
      <TermsAndConditions />
    </>
  );
}
