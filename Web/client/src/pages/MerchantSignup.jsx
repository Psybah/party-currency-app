import { useState, useContext } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getProfileApi, signupMerchantApi } from "@/services/apiAuth";
import { USER_PROFILE_CONTEXT } from "@/context";
import { storeAuth } from "@/lib/util";

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    businessType: z.string().min(1, "Please select a business type"),
    country: z.string().min(1, "Please select a country"),
    state: z.string().min(1, "Please select a state"),
    city: z.string().min(1, "Please select a city"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function MerchantSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
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
    if (values.password !== values.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await signupMerchantApi(values);

      const data = await response.json();
      if (response.ok) {
        console.log("mercant signup successful:", data);
        const accessToken = data.token; // Get the token from API response
        // Store token in cookies and user type in local storage
        storeAuth(accessToken, "merchant", true);

        // Fetch user profile using the access token
        const userProfileResponse = await getProfileApi();
        if (userProfileResponse.ok) {
          const userProfileData = await userProfileResponse.json();
          setUserProfile(userProfileData); // Update user profile context
          console.log("Merchant profile fetched:", userProfileData);
          navigate("/dashboard"); // Redirect to dashboard
        } else {
          throw new Error("Failed to fetch user profile.");
        }
      } else {
        setErrorMessage(data.message || "Unable to signup .");
      }
    } catch (error) {
      setErrorMessage("An error occurred during signup.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen">
      {/* Back Button */}
      <div className="absolute top-4 left-4 md:left-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-black transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="ml-2 text-sm md:text-base">Back</span>
        </button>
      </div>
      <div className="space-y-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-6"
          />
          <h1 className="font-playfair text-3xl">
            Sign up as merchant
          </h1>
        </div>
        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="gap-4 grid grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="example@gmail.com" {...field} />
                      <Mail className="top-1/2 right-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kiosk">Kiosk operator</SelectItem>
                      <SelectItem value="foot-soldier">
                        Foot soldier
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ng">Nigeria</SelectItem>
                      <SelectItem value="gh">Ghana</SelectItem>
                      <SelectItem value="ke">Kenya</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="gap-4 grid grid-cols-2">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="ph">Port Harcourt</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ikeja">Ikeja</SelectItem>
                        <SelectItem value="lekki">Lekki</SelectItem>
                        <SelectItem value="vi">Victoria Island</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+234..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-footer hover:bg-[#2D2D2D] w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Create an account"}
            </Button>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="border-t border-lightgray w-full"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="gap-4 grid grid-cols-2">
                <Button variant="outline" className="border-lightgray">
                  <img src="/google.svg" alt="Google" className="mr-2 w-5 h-5" />
                  Google
                </Button>
                <Button variant="outline" className="border-lightgray">
                  <img src="/apple.svg" alt="Apple" className="mr-2 w-5 h-5" />
                  Apple
                </Button>
              </div>
            </div>

            <div className="text-center text-sm">
              By clicking 'Create an Account' above, you acknowledge that you have read, 
              understood, and agree to Party Currency's{" "}
              <Link to="/terms" className="text-gold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </Link>
              .
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}