import type { IVendor, VendorStatus } from "../models/Vendor"
import { Vendor } from "../models/Vendor"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

type LeanVendor = {
  _id: unknown
  name: string
  city: string
  fleet: number
  drivers: number
  rating: number
  revenue: number
  status: VendorStatus
  joined?: string
}

function publicVendor(v: IVendor | LeanVendor) {
  return {
    id: String(v._id),
    name: v.name,
    city: v.city,
    fleet: v.fleet,
    drivers: v.drivers,
    rating: v.rating,
    revenue: v.revenue,
    status: v.status,
    joined: v.joined ?? "",
  }
}

export const listVendors = asyncHandler(async (_req, res) => {
  const vendors = (await Vendor.find().sort({ createdAt: -1 }).lean()) as LeanVendor[]
  res.json({ success: true, data: { vendors: vendors.map(publicVendor) } })
})

export const getVendor = asyncHandler(async (req, res) => {
  const vendor = (await Vendor.findById(req.params.id).lean()) as LeanVendor | null
  if (!vendor) throw new ApiError(404, "Vendor not found")
  res.json({ success: true, data: { vendor: publicVendor(vendor) } })
})

export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.create(req.body)
  res.status(201).json({ success: true, data: { vendor: publicVendor(vendor) } })
})

export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!vendor) throw new ApiError(404, "Vendor not found")
  res.json({ success: true, data: { vendor: publicVendor(vendor) } })
})

export const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndDelete(req.params.id)
  if (!vendor) throw new ApiError(404, "Vendor not found")
  res.json({ success: true, data: { id: String(vendor._id) } })
})
