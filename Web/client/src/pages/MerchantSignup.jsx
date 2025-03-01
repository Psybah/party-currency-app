import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthFormWrapper } from "@/components/forms/AuthFormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { SocialAuthButtons } from "@/components/forms/SocialAuthButtons";
import { merchantSignupSchema } from "@/lib/validations/auth";
import { USER_PROFILE_CONTEXT } from "@/context";
import { getProfileApi, signupMerchantApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { formatErrorMessage } from "../utils/errorUtils";

export default function MerchantSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const [errorMessage, setErrorMessage] = useState("");
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
      phoneNumber: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await signupMerchantApi(values);
      const data = await response.json();

      if (response.ok) {
        const accessToken = data.token;
        storeAuth(accessToken, "merchant", true);
        setUserProfile(data.user);
        navigate("/merchant/transactions");
      } else {
        setErrorMessage(formatErrorMessage(data.message) || "Signup failed. Please check your information and try again.");
      }
    } catch (error) {
      setErrorMessage("Network error occurred. Please check your connection and try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingDisplay />;
  }

  return (
    <AuthFormWrapper
      title="Sign up as merchant"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkPath="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="gap-4 grid grid-cols-2">
            <FormInput
              label="First Name"
              name="firstName"
              control={form.control}
              placeholder="John"
              labelClassName="text-left"
            />
            <FormInput
              label="Last Name"
              name="lastName"
              control={form.control}
              placeholder="Doe"
              labelClassName="text-left"
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            control={form.control}
            placeholder="john@example.com"
            labelClassName="text-left"
          />

          <FormInput
            label="Phone Number"
            name="phoneNumber"
            control={form.control}
            placeholder="+234..."
            labelClassName="text-left"
          />

          <FormInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            control={form.control}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
            labelClassName="text-left"
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            control={form.control}
            showPasswordToggle
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            labelClassName="text-left"
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 text-left">
                Business Type
              </label>
              <Select
                onValueChange={(value) => form.setValue("businessType", value)}
                defaultValue={form.getValues("businessType")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kiosk">Kiosk operator</SelectItem>
                  <SelectItem value="foot-soldier">Foot soldier</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.businessType && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.businessType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 text-left">
                Country
              </label>
              <input
                type="text"
                id="country"
                value="Nigeria"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 text-left">
                  State
                </label>
                <FormInput
                  name="state"
                  control={form.control}
                />
                {form.formState.errors.state && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.state.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 text-left">
                  City
                </label>
                <FormInput
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ikeja">Ikeja</SelectItem>
                        <SelectItem value="lekki">Lekki</SelectItem>
                        <SelectItem value="vi">Victoria Island</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-paragraph" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <SocialAuthButtons />
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
