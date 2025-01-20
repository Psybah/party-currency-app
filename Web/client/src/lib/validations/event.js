import { z } from "zod";

export const eventSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  event_description: z.string().optional(),
  event_date: z.string().min(1, "Event date is required"),
  address: z.string().min(1, "Event address is required"),
  delivery_address: z.string().optional(),
});