import cors from "cors"
import express from "express"

import { env } from "./config/env"
import { errorHandler, notFound } from "./middlewares/error.middleware"
import authRoutes from "./routes/auth.routes"

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "CabTourist API",
      version: "0.1.0",
    })
  })

  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  })

  app.use("/api/auth", authRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
