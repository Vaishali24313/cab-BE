import crypto from "node:crypto"
import bcrypt from "bcryptjs"

import { env } from "../config/env"

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString()
}

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 10)
}

export async function verifyOtpCode(
  plain: string,
  codeHash: string
): Promise<boolean> {
  return bcrypt.compare(plain, codeHash)
}

export function otpExpiryDate(): Date {
  return new Date(Date.now() + env.OTP_TTL_MINUTES * 60_000)
}
