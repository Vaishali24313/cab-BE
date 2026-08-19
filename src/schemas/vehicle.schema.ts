import { z } from "zod"

const vehicleFields = {
  name: z.string().trim().min(1, "Name is required").max(80),
  description: z.string().trim().max(300).default(""),
  seats: z.coerce.number().min(1, "At least 1 seat").max(20),
  bags: z.coerce.number().min(0).max(20),
  perKm: z.coerce.number().min(0, "Per km price must be positive"),
  baseFare: z.coerce.number().min(0, "Base fare must be positive"),
  eta: z.string().trim().max(20).default("5 min"),
  ac: z.coerce.boolean().default(true),
  image: z
    .string()
    .trim()
    .min(1, "Image is required")
    .max(500)
    .default("/placeholder.svg"),
  active: z.coerce.boolean().default(true),
}

export const createVehicleSchema = z.object(vehicleFields)

export const updateVehicleSchema = z
  .object(vehicleFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
