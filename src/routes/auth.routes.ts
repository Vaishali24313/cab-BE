import { Router } from "express"
import { rateLimit } from "express-rate-limit"

import * as auth from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validate.middleware"
import * as schemas from "../schemas/auth.schema"

const router = Router()

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Try again later.",
  },
})

router.post("/register", validate(schemas.registerSchema), auth.register)
router.post("/login", validate(schemas.loginSchema), auth.login)
router.post("/google", validate(schemas.googleLoginSchema), auth.google)
router.post("/logout", auth.logout)

router.post("/send-otp", otpLimiter, validate(schemas.sendOtpSchema), auth.sendOtp)
router.post(
  "/verify-otp",
  validate(schemas.verifyOtpSchema),
  auth.verifyOtp
)

router.post(
  "/forgot-password",
  validate(schemas.forgotPasswordSchema),
  auth.forgotPassword
)
router.post(
  "/reset-password",
  validate(schemas.resetPasswordSchema),
  auth.resetPassword
)

router.get("/me", authenticate, auth.me)

export default router
