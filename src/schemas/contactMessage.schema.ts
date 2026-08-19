import { z } from "zod"

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().min(1, "Email is required").max(200).email("Invalid email"),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
})
