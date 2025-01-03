import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
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
    setLoading(true);
    try {
      const response = await axios.post("https://api.partycurrency.com/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        businessType: values.businessType,
        country: values.country,
        state: values.state,
        city: values.city,
        phoneNumber: values.phoneNumber,
      });
      alert("Signup successful! Check your email for confirmation.");
      console.log(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message || "An error occurred during signup."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative bg-white p-4 sm:p-6 min-h-screen">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-6"
          />
          <h1 className="font-bold font-playfair text-3xl text-gray-900">
            Sign up as merchant
          </h1>
        </div>

        <div className="relative gap-8 grid md:grid-cols-2">
          <div className="md:block top-0 bottom-0 left-1/2 absolute hidden bg-gold w-px" />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
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
                        <SelectItem value="foot-soldier">Foot soldier</SelectItem>
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
                      <Input placeholder="+234123456789" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Create an account"}
              </Button>

              <p className="text-gray-500 text-sm">
                By clicking "Create account" above, you acknowledge that you
                will receive updates from Party Currency team and that you have
                read, understood, and agreed to Party Currency{" "}
                <Link href="/terms" className="text-gold hover:underline">
                  Terms Of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-gold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </Form>
          <div className="space-y-4 md:pl-8">
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <Button
                variant="outline"
                className="flex justify-center items-center gap-2 w-full"
              >
                <img
                  src="/google.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="flex justify-center items-center gap-2 w-full"
              >
                <img
                  src="/apple.svg"
                  alt="Apple logo"
                  width={20}
                  height={20}
                />
                Continue with Apple
              </Button>
            </div>
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}