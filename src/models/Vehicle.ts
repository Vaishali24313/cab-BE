import { model, models, Schema, type Document, type Model } from "mongoose"

export interface IVehicle extends Document {
  name: string
  description: string
  seats: number
  bags: number
  perKm: number
  baseFare: number
  eta: string
  ac: boolean
  image: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const vehicleSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", trim: true, maxlength: 300 },
    seats: { type: Number, required: true, min: 1, max: 20 },
    bags: { type: Number, required: true, min: 0, max: 20 },
    perKm: { type: Number, required: true, min: 0 },
    baseFare: { type: Number, required: true, min: 0 },
    eta: { type: String, default: "5 min", trim: true, maxlength: 20 },
    ac: { type: Boolean, default: true },
    image: { type: String, default: "/placeholder.svg", maxlength: 500 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

vehicleSchema.index({ name: "text", description: "text" })

export const Vehicle: Model<IVehicle> =
  (models.Vehicle as Model<IVehicle> | undefined) ??
  model<IVehicle>("Vehicle", vehicleSchema)
