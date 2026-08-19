import cors from "cors"
import express from "express"
import path from "path"

import { env } from "./config/env"
import { errorHandler, notFound } from "./middlewares/error.middleware"
import authRoutes from "./routes/auth.routes"
import adminRoutes from "./routes/admin.routes"
import bookingRoutes from "./routes/booking.routes"
import tourPackageRoutes from "./routes/tourPackage.routes"
import vendorRoutes from "./routes/vendor.routes"
import vehicleRoutes from "./routes/vehicle.routes"
import uploadRoutes from "./routes/upload.routes"
import contactMessageRoutes from "./routes/contactMessage.routes"

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

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
  app.use("/api/admin", adminRoutes)
  app.use("/api/bookings", bookingRoutes)
  app.use("/api/packages", tourPackageRoutes)
  app.use("/api/vendors", vendorRoutes)
  app.use("/api/vehicles", vehicleRoutes)
  app.use("/api/admin/upload", uploadRoutes)
  app.use("/api/contact", contactMessageRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
