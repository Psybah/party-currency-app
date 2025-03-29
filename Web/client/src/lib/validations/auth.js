import * as z from "zod";

export const merchantSignupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    businessType: z.string().min(1, "Please select a business type"),
    country: z.string().min(1, "Please select a country"),
    state: z.string().min(1, "Please select a state"),
    city: z.string().min(1, "Please select a city"),
    phoneNumber: z
      .string()
      .startsWith("+234", "Phone number must start with +234")
      .min(13, "Phone number must be at least 10 digits long")
      .max(14, "Phone number must be 10-11 digits long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const celebrantSignupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    phone: z
      .string()
      .startsWith("+234", "Phone number must start with +234")
      .min(13, "Phone number must be at least 10 digits long")
      .max(14, "Phone number must be 10-11 digits long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
