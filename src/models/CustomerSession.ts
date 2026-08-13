import { model, models, Schema, type Document, type Model } from "mongoose"

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown"

export interface IDeviceInfo {
  type: DeviceType
  browser: string
  os: string
  model?: string
}

export interface ILocationInfo {
  city?: string
  region?: string
  country?: string
  lat?: number
  lon?: number
}

export interface ICustomerSession extends Document {
  user: Schema.Types.ObjectId
  name: string
  email?: string
  phone?: string
  loginMethod: "email" | "google" | "phone"
  userAgent?: string
  device: IDeviceInfo
  ip?: string
  location: ILocationInfo
  createdAt: Date
  updatedAt: Date
}

const deviceSchema = new Schema<IDeviceInfo>(
  {
    type: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    browser: { type: String, default: "Unknown" },
    os: { type: String, default: "Unknown" },
    model: { type: String },
  },
  { _id: false }
)

const locationSchema = new Schema<ILocationInfo>(
  {
    city: { type: String },
    region: { type: String },
    country: { type: String },
    lat: { type: Number },
    lon: { type: Number },
  },
  { _id: false }
)

const customerSessionSchema = new Schema<ICustomerSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String },
    loginMethod: {
      type: String,
      enum: ["email", "google", "phone"],
      required: true,
    },
    userAgent: { type: String },
    device: { type: deviceSchema, default: () => ({}) },
    ip: { type: String },
    location: { type: locationSchema, default: () => ({}) },
  },
  { timestamps: true }
)

customerSessionSchema.index({ createdAt: -1 })

export const CustomerSession: Model<ICustomerSession> =
  (models.CustomerSession as Model<ICustomerSession> | undefined) ??
  model<ICustomerSession>("CustomerSession", customerSessionSchema)
