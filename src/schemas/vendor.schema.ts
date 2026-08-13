import { z } from "zod"

const vendorFields = {
  name: z.string().trim().min(1, "Name is required").max(120),
  city: z.string().trim().min(1, "City is required").max(80),
  fleet: z.coerce.number().min(0).default(1),
  drivers: z.coerce.number().min(0).default(1),
  rating: z.coerce.number().min(0).max(5).default(4.5),
  revenue: z.coerce.number().min(0).default(0),
  status: z.enum(["active", "pending", "suspended"]).default("active"),
  joined: z.string().trim().max(10).optional(),
}

export const createVendorSchema = z.object(vendorFields)

export const updateVendorSchema = z
  .object(vendorFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
