import crypto from "node:crypto"
import bcrypt from "bcryptjs"

import { env } from "../config/env"
import { Otp } from "../models/Otp"
import { User, type IUser } from "../models/User"
import { hashOtp, generateOtp, verifyOtpCode, otpExpiryDate } from "../services/otp.service"
import { signToken } from "../services/token.service"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

function publicUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    role: user.role,
  }
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(409, "An account with this email already exists")
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })

  const token = signToken(user)
  res.status(201).json({
    success: true,
    message: "Account created",
    data: { token, user: publicUser(user) },
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select("+passwordHash")
  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  if (!user.passwordHash) {
    throw new ApiError(401, "This account uses another sign-in method")
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new ApiError(401, "Invalid email or password")
  }

  const token = signToken(user)
  res.json({
    success: true,
    message: "Signed in",
    data: { token, user: publicUser(user) },
  })
})

export const google = asyncHandler(async (req, res) => {
  const { email, googleId, name } = req.body

  let user = await User.findOne({ $or: [{ googleId }, { email }] })

  if (!user) {
    user = await User.create({
      name: name ?? email.split("@")[0],
      email,
      googleId,
      isEmailVerified: true,
    })
  } else {
    if (!user.googleId) {
      user.googleId = googleId
      user.isEmailVerified = true
    }
    if (!user.email) {
      user.email = email
    }
    await user.save()
  }

  const token = signToken(user)
  res.json({
    success: true,
    message: "Signed in with Google",
    data: { token, user: publicUser(user) },
  })
})

export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: "Signed out" })
})

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: publicUser(req.user!) } })
})

export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body

  const code = generateOtp()
  const codeHash = await hashOtp(code)

  await Otp.findOneAndUpdate(
    { phone },
    {
      codeHash,
      expiresAt: otpExpiryDate(),
      attempts: 0,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true, new: true }
  )

  // TODO: integrate an SMS provider here. OTP is logged for development only.
  console.log(`[OTP] OTP for ${phone}: ${code}`)

  res.json({
    success: true,
    message: "OTP sent",
    data: { expiresInMinutes: env.OTP_TTL_MINUTES },
  })
})

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp, name } = req.body

  const record = await Otp.findOne({ phone })
  if (!record) {
    throw new ApiError(400, "No OTP found for this number. Request a new OTP.")
  }

  if (record.expiresAt < new Date()) {
    await record.deleteOne()
    throw new ApiError(400, "OTP has expired. Request a new OTP.")
  }

  record.attempts += 1
  if (record.attempts > 5) {
    await record.deleteOne()
    throw new ApiError(429, "Too many attempts. Request a new OTP.")
  }

  const valid = await verifyOtpCode(otp, record.codeHash)
  if (!valid) {
    await record.save()
    throw new ApiError(400, "Invalid OTP")
  }

  await record.deleteOne()

  let user = await User.findOne({ phone })
  const isNewUser = !user

  if (!user) {
    if (!name) {
      throw new ApiError(400, "Name is required to create an account")
    }
    user = await User.create({ name, phone, isPhoneVerified: true })
  } else {
    if (!user.isPhoneVerified) {
      user.isPhoneVerified = true
      await user.save()
    }
  }

  const token = signToken(user)
  res.json({
    success: true,
    message: "Phone verified",
    data: { token, user: publicUser(user), isNewUser },
  })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, "No account found with this email")
  }

  const token = crypto.randomBytes(32).toString("hex")
  user.resetPasswordHash = await bcrypt.hash(token, 10)
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
  await user.save()

  // TODO: integrate an email provider here. Token is logged for development only.
  console.log(`[RESET] Reset token for ${email}: ${token}`)

  res.json({ success: true, message: "Password reset link sent" })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, "No account found with this email")
  }

  if (!user.resetPasswordHash || !user.resetPasswordExpires) {
    throw new ApiError(400, "No password reset was requested")
  }

  if (user.resetPasswordExpires < new Date()) {
    throw new ApiError(400, "Reset link has expired")
  }

  const valid = await bcrypt.compare(token, user.resetPasswordHash)
  if (!valid) {
    throw new ApiError(400, "Invalid or expired reset token")
  }

  user.passwordHash = await bcrypt.hash(password, 10)
  user.resetPasswordHash = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  res.json({ success: true, message: "Password updated. Please sign in." })
})
