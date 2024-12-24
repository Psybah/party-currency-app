import { useState } from 'react'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function MerchantSignup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
  })

  function onSubmit(values) {
    console.log(values)
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 relative">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900">Sign up as merchant</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gold hidden md:block" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <Button type="submit" className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D]">
                Create an account
              </Button>

              <p className="text-sm text-gray-500">
                By clicking "Create account" above, you acknowledge that you will receive updates
                from Party Currency team and that you have read, understood, and agreed to Party Currency{' '}
                <Link href="/terms" className="text-gold-600 hover:underline">
                  Terms Of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-gold-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </Form>
          <div className="space-y-4 md:pl-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
              >
                <Image
                  src="/google.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                Continue with Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
              >
                <Image
                  src="/apple.svg"
                  alt="Apple logo"
                  width={20}
                  height={20}
                />
                Continue with Apple
              </Button>
            </div>
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
