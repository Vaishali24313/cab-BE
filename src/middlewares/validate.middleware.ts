import type { RequestHandler } from "express"
import type { ZodSchema } from "zod"

import { ApiError } from "../utils/ApiError"

export function validate(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const details = result.error.flatten().fieldErrors
      return next(new ApiError(400, "Validation failed", details))
    }
    req.body = result.data
    next()
  }
}
