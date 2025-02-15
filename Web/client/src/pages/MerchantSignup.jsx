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
        setErrorMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred during signup");
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
            <div className="bg-red-50 p-3 rounded-md text-red-500 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="gap-4 grid grid-cols-2">
            <FormInput
              label="First Name"
              name="firstName"
              control={form.control}
              placeholder="John"
            />
            <FormInput
              label="Last Name"
              name="lastName"
              control={form.control}
              placeholder="Doe"
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            control={form.control}
            placeholder="example@gmail.com"
          />

          <FormInput
            label="Password"
            name="password"
            control={form.control}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            control={form.control}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="businessType" className="text-sm text-left font-medium text-gray-700">
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
                <p className="text-sm text-red-500">
                  {form.formState.errors.businessType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm text-left font-medium text-gray-700">
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
              <FormInput
                label="State"
                name="state"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="ph">Port Harcourt</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <FormInput
                label="City"
                name="city"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
            </div>

            <FormInput
              label="Phone number"
              name="phoneNumber"
              control={form.control}
              placeholder="+234..."
            />
          </div>

          <Button
            type="submit"
            className="bg-footer hover:bg-[#2D2D2D] w-full"
            disabled={loading}
          >
            Create an account
          </Button>

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
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
