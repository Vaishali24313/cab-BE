import type { ITourPackage } from "../models/TourPackage"
import { TourPackage } from "../models/TourPackage"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

type LeanPackage = {
  _id: unknown
  title: string
  location: string
  image: string
  nights: number
  days: number
  rating: number
  reviews: number
  fromPrice: number
  highlights: string[]
  tag?: string
}

function publicPackage(pkg: ITourPackage | LeanPackage) {
  return {
    id: String(pkg._id),
    title: pkg.title,
    location: pkg.location,
    image: pkg.image,
    nights: pkg.nights,
    days: pkg.days,
    rating: pkg.rating,
    reviews: pkg.reviews,
    fromPrice: pkg.fromPrice,
    highlights: pkg.highlights,
    tag: pkg.tag ?? undefined,
  }
}

export const listPackages = asyncHandler(async (_req, res) => {
  const packages = (await TourPackage.find().sort({ createdAt: -1 }).lean()) as LeanPackage[]
  res.json({ success: true, data: { packages: packages.map(publicPackage) } })
})

export const getPackage = asyncHandler(async (req, res) => {
  const pkg = (await TourPackage.findById(req.params.id).lean()) as LeanPackage | null
  if (!pkg) throw new ApiError(404, "Tour package not found")
  res.json({ success: true, data: { package: publicPackage(pkg) } })
})

export const createPackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.create(req.body)
  res.status(201).json({ success: true, data: { package: publicPackage(pkg) } })
})

export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!pkg) throw new ApiError(404, "Tour package not found")
  res.json({ success: true, data: { package: publicPackage(pkg) } })
})

export const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findByIdAndDelete(req.params.id)
  if (!pkg) throw new ApiError(404, "Tour package not found")
  res.json({ success: true, data: { id: String(pkg._id) } })
})
