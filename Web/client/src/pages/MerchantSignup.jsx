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
      country: "",
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
        console.log("Merchant signup successful:", data);
        const accessToken = data.token;
        storeAuth(accessToken, "merchant", true);

        const userProfileResponse = await getProfileApi();
        if (userProfileResponse.ok) {
          const userProfileData = await userProfileResponse.json();
          setUserProfile(userProfileData);
          navigate("/dashboard");
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } else {
        setErrorMessage(data.message || "Unable to signup");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred during signup. Please try again.");
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
            <FormInput
              label="Business Type"
              name="businessType"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kiosk">Kiosk operator</SelectItem>
                    <SelectItem value="foot-soldier">Foot soldier</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <FormInput
              label="Country"
              name="country"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ng">Nigeria</SelectItem>
                    <SelectItem value="gh">Ghana</SelectItem>
                    <SelectItem value="ke">Kenya</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

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
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
