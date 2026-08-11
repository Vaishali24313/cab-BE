import { model, models, Schema, type Document, type Model } from "mongoose"

export interface IOtp extends Document {
  phone: string
  codeHash: string
  expiresAt: Date
  attempts: number
  createdAt: Date
  updatedAt: Date
}

const otpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
)

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 })

export const Otp: Model<IOtp> =
  (models.Otp as Model<IOtp> | undefined) ?? model<IOtp>("Otp", otpSchema)
