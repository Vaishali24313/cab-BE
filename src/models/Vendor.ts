import { model, models, Schema, type Document, type Model } from "mongoose"

export type VendorStatus = "active" | "pending" | "suspended"

export interface IVendor extends Document {
  name: string
  city: string
  fleet: number
  drivers: number
  rating: number
  revenue: number
  status: VendorStatus
  joined: string
  createdAt: Date
  updatedAt: Date
}

const vendorSchema = new Schema<IVendor>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    fleet: { type: Number, required: true, min: 0, default: 1 },
    drivers: { type: Number, required: true, min: 0, default: 1 },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    revenue: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "active",
    },
    joined: { type: String, trim: true },
  },
  { timestamps: true }
)

vendorSchema.index({ name: "text", city: "text" })

export const Vendor: Model<IVendor> =
  (models.Vendor as Model<IVendor> | undefined) ??
  model<IVendor>("Vendor", vendorSchema)
