import type { NextFunction, Response } from "express"

import { User } from "../models/User"
import { verifyToken } from "../services/token.service"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

export const authenticate = asyncHandler(
  async (req, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authenticated")
    }

    const token = header.slice("Bearer ".length)
    let payload: { userId: string }
    try {
      payload = verifyToken(token)
    } catch {
      throw new ApiError(401, "Invalid or expired token")
    }

    const user = await User.findById(payload.userId)
    if (!user) {
      throw new ApiError(401, "User no longer exists")
    }

    req.user = user
    next()
  }
)
