import { z } from "zod"

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
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const googleLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  googleId: z.string().min(1, "googleId is required"),
  name: z.string().trim().min(1).max(60).optional(),
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
