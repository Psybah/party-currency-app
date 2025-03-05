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

export function MerchantSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();

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

    try {
      const response = await signupMerchantApi(values);
      const data = await response.json();

      if (response.ok) {
        console.log("Merchant signup successful:", data);
        const accessToken = data.token;
        storeAuth(accessToken, "merchant", true);
        setUserProfile(data.user || {
          firstname: values.firstName,
          lastname: values.lastName,
          email: values.email,
        });
        navigate("/merchant/dashboard");
      } else {
        const errorData = formatErrorMessage(data);
        console.log("API Error response:", errorData);
        
        // Handle specific field errors
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
        
        // Handle other field errors
        if (errorData.phone_number) {
          form.setError("phoneNumber", { 
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
        
        // Show generic toast error if no specific field errors
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

          <BusinessInfoInputs form={form} />

          <PhoneInput
            label="Phone number"
            name="phoneNumber"
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
