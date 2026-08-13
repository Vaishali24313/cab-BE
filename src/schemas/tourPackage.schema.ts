import { z } from "zod"

const packageFields = {
  title: z.string().trim().min(1, "Title is required").max(120),
  location: z.string().trim().min(1, "Location is required").max(120),
  image: z
    .string()
    .trim()
    .min(1, "Image is required")
    .max(500)
    .default("/placeholder.svg"),
  nights: z.coerce.number().min(0).max(60).default(0),
  days: z.coerce.number().min(1).max(90).default(1),
  rating: z.coerce.number().min(0).max(5).default(4.5),
  reviews: z.coerce.number().min(0).default(0),
  fromPrice: z.coerce.number().min(0, "fromPrice must be positive"),
  highlights: z.array(z.string().trim().min(1)).default([]),
  tag: z.string().trim().max(40).optional(),
}

export const createPackageSchema = z.object(packageFields)

export const updatePackageSchema = z
  .object(packageFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
