import type { BookingStatus, IBooking, TripType } from "../models/Booking"
import { Booking } from "../models/Booking"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

type LeanBooking = {
  _id: unknown
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
}

function generateRef(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CT-${rand}`
}

function publicBooking(b: IBooking | LeanBooking) {
  return {
    id: String(b._id),
    ref: b.ref,
    customer: b.customer,
    phone: b.phone,
    email: b.email,
    route: `${b.fromCity} \u2192 ${b.toCity}`,
    fromCity: b.fromCity,
    toCity: b.toCity,
    tripType: b.tripType,
    cab: b.cab,
    date: b.date,
    time: b.time,
    returnDate: b.returnDate,
    distanceKm: b.distanceKm,
    amount: b.amount,
    status: b.status,
    driver: b.driver,
    createdAt:
      b.createdAt instanceof Date
        ? b.createdAt.toISOString()
        : String(b.createdAt),
  }
}

export const createBooking = asyncHandler(async (req, res) => {
  let doc: IBooking | null = null
  for (let attempt = 0; attempt < 3 && !doc; attempt++) {
    try {
      const created = await Booking.create({ ...req.body, ref: generateRef() })
      doc = Array.isArray(created) ? created[0] : created
    } catch (err) {
      const code = (err as { code?: number })?.code
      if (code !== 11000) throw err
    }
  }
  if (!doc) throw new ApiError(409, "Could not generate a unique booking ID")
  res.status(201).json({ success: true, data: { booking: publicBooking(doc) } })
})

export const getBooking = asyncHandler(async (req, res) => {
  const booking = (await Booking.findById(req.params.id).lean()) as LeanBooking | null
  if (!booking) throw new ApiError(404, "Booking not found")
  res.json({ success: true, data: { booking: publicBooking(booking) } })
})

export const listMyBookings = asyncHandler(async (req, res) => {
  const email = typeof req.query.email === "string" ? req.query.email : ""
  const phone = typeof req.query.phone === "string" ? req.query.phone : ""
  if (!email && !phone) {
    throw new ApiError(400, "Provide email or phone to look up bookings")
  }

  const query: Record<string, string> = {}
  if (email) query.email = email.toLowerCase()
  if (phone) query.phone = phone

  const bookings = (await Booking.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()) as LeanBooking[]

  res.json({ success: true, data: { bookings: bookings.map(publicBooking) } })
})

export const listBookings = asyncHandler(async (_req, res) => {
  const bookings = (await Booking.find().sort({ createdAt: -1 }).lean()) as LeanBooking[]
  res.json({ success: true, data: { bookings: bookings.map(publicBooking) } })
})

export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!booking) throw new ApiError(404, "Booking not found")
  res.json({ success: true, data: { booking: publicBooking(booking) } })
})

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id)
  if (!booking) throw new ApiError(404, "Booking not found")
  res.json({ success: true, data: { id: String(booking._id) } })
})
