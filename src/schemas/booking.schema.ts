import { z } from "zod"

const bookingFields = {
  customer: z.string().trim().min(2, "Name is required").max(60),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().toLowerCase().email("Invalid email address").optional(),
  fromCity: z.string().trim().min(1, "Pickup city is required").max(80),
  toCity: z.string().trim().min(1, "Drop-off city is required").max(80),
  tripType: z.enum(["oneway", "roundtrip", "rental", "airport"]).default("oneway"),
  cab: z.string().trim().min(1, "Cab is required").max(80),
  date: z.string().trim().min(1, "Pickup date is required").max(20),
  time: z.string().trim().max(10).optional(),
  returnDate: z.string().trim().max(20).optional(),
  distanceKm: z.coerce.number().min(1).max(5000).default(100),
  amount: z.coerce.number().min(0, "Amount must be positive"),
}

export const createBookingSchema = z.object(bookingFields)

export const updateBookingSchema = z
  .object({
    status: z.enum(["confirmed", "ongoing", "completed", "cancelled", "pending"]),
    driver: z.string().trim().max(80).optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
