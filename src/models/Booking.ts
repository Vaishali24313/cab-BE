import { model, models, Schema, type Document, type Model } from "mongoose"

export type BookingStatus = "confirmed" | "ongoing" | "completed" | "cancelled" | "pending"
export type TripType = "oneway" | "roundtrip" | "rental" | "airport"

export interface IBooking extends Document {
  ref: string
  customer: string
  phone?: string
  email?: string
  fromCity: string
  toCity: string
  tripType: TripType
  cab: string
  date: string
  time?: string
  returnDate?: string
  distanceKm: number
  amount: number
  status: BookingStatus
  driver?: string
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new Schema<IBooking>(
  {
    ref: { type: String, required: true, unique: true, trim: true },
    customer: { type: String, required: true, trim: true, maxlength: 60 },
    phone: { type: String, trim: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true, maxlength: 120 },
    fromCity: { type: String, required: true, trim: true, maxlength: 80 },
    toCity: { type: String, required: true, trim: true, maxlength: 80 },
    tripType: {
      type: String,
      enum: ["oneway", "roundtrip", "rental", "airport"],
      default: "oneway",
    },
    cab: { type: String, required: true, trim: true, maxlength: 80 },
    date: { type: String, required: true, trim: true, maxlength: 20 },
    time: { type: String, trim: true, maxlength: 10 },
    returnDate: { type: String, trim: true, maxlength: 20 },
    distanceKm: { type: Number, min: 1, default: 100 },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["confirmed", "ongoing", "completed", "cancelled", "pending"],
      default: "pending",
    },
    driver: { type: String, trim: true, maxlength: 80 },
  },
  { timestamps: true }
)

bookingSchema.index({ createdAt: -1 })
bookingSchema.index({ email: 1 })
bookingSchema.index({ phone: 1 })

export const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking> | undefined) ??
  model<IBooking>("Booking", bookingSchema)
