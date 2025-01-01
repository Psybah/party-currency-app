import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import axios from "axios";
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
import { BASE_URL } from "@/config";

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
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup/merchant`, {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
        business_type: values.businessType,
        country: values.country,
        state: values.state,
        city: values.city,
        phone_number: values.phoneNumber,
      });

      if (response.status === 201) {
        alert("Signup successful! Please check your email to verify your account.");
        navigate("/login"); // Redirect to login page
      } else {
        setErrorMessage(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
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
          <h1 className="font-bold text-3xl text-gray-900">
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
              {/* Display Error Message */}
              {errorMessage && (
                <div className="p-4 bg-red-100 text-red-700 rounded">
                  {errorMessage}
                </div>
              )}

              {/* Form Fields */}
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

              {/* Email Field */}
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

              {/* Other Fields... */}
              {/* Similar structure for password, confirmPassword, and dropdowns */}

              {/* Submit Button */}
              <Button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Create an account"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
