import type { NextFunction, Response } from "express"

import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

export const requireAdmin = asyncHandler(
  async (req, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      throw new ApiError(403, "Admin access required")
    }
    next()
  }
)
