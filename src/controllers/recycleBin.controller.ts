import { RecycleBin } from "../models/RecycleBin"
import { TourPackage } from "../models/TourPackage"
import { Vehicle } from "../models/Vehicle"
import { Vendor } from "../models/Vendor"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

const COLLECTION_MAP: Record<string, typeof TourPackage | typeof Vehicle | typeof Vendor> = {
  packages: TourPackage,
  vehicles: Vehicle,
  vendors: Vendor,
}

export const listDeleted = asyncHandler(async (req, res) => {
  const { collection } = req.query
  const filter: Record<string, unknown> = {}
  if (collection && typeof collection === "string") {
    filter.sourceCollection = collection
  }
  const items = await RecycleBin.find(filter).sort({ deletedAt: -1 }).lean()
  res.json({ success: true, data: { items } })
})

export const restoreItem = asyncHandler(async (req, res) => {
  const item = await RecycleBin.findById(req.params.id)
  if (!item) throw new ApiError(404, "Item not found in recycle bin")

  const Model = COLLECTION_MAP[item.sourceCollection]
  if (!Model) throw new ApiError(400, `Unknown collection: ${item.sourceCollection}`)

  const { _id, ...rest } = item.data as Record<string, unknown> & { _id?: unknown }
  await (Model as typeof TourPackage).create({ ...rest, _id: item.itemId })
  await RecycleBin.findByIdAndDelete(item._id)

  res.json({ success: true, data: { id: item.itemId, collection: item.sourceCollection } })
})

export const permanentDelete = asyncHandler(async (req, res) => {
  const item = await RecycleBin.findByIdAndDelete(req.params.id)
  if (!item) throw new ApiError(404, "Item not found in recycle bin")
  res.json({ success: true, data: { id: String(item._id) } })
})

export const emptyBin = asyncHandler(async (req, res) => {
  const { collection } = req.query
  const filter: Record<string, unknown> = {}
  if (collection && typeof collection === "string") {
    filter.sourceCollection = collection
  }
  await RecycleBin.deleteMany(filter)
  res.json({ success: true, data: { deleted: true } })
})
