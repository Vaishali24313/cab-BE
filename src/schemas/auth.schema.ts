import { z } from "zod"

const deviceSchema = z
  .object({
    type: z.enum(["desktop", "mobile", "tablet", "unknown"]).optional(),
    browser: z.string().trim().max(40).optional(),
    os: z.string().trim().max(40).optional(),
    model: z.string().trim().max(80).optional(),
  })
  .optional()

const locationSchema = z
  .object({
    city: z.string().trim().max(80).optional(),
    region: z.string().trim().max(80).optional(),
    country: z.string().trim().max(60).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lon: z.number().min(-180).max(180).optional(),
  })
  .optional()

const clientMetaSchema = z
  .object({
    device: deviceSchema,
    location: locationSchema,
  })
  .optional()

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  clientMeta: clientMetaSchema,
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  clientMeta: clientMetaSchema,
})

export const googleLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  googleId: z.string().min(1, "googleId is required"),
  name: z.string().trim().min(1).max(60).optional(),
  clientMeta: clientMetaSchema,
})

const phoneRegex = /^[6-9]\d{9}$/

export const sendOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid Indian mobile number"),
  name: z.string().trim().min(2).max(60).optional(),
})

export const verifyOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid Indian mobile number"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  name: z.string().trim().min(2).max(60).optional(),
  clientMeta: clientMetaSchema,
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
})
