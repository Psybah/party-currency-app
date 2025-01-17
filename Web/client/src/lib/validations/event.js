import { z } from "zod";

export const eventSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  event_type: z.string().min(1, "Event type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  street_address: z.string().min(1, "Street address is required"),
  post_code: z.string().min(1, "Post code is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  lga: z.string().min(1, "LGA is required"),
  reconciliation_service: z.boolean(),
});