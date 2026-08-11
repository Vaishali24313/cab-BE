import type { ErrorRequestHandler, RequestHandler } from "express"

import { ApiError } from "../utils/ApiError"

export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    })
  }

  if (err?.name === "MongoServerError" && err?.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field"
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  console.error(err)
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  })
}
