import type { IVehicle } from "../models/Vehicle"
import { Vehicle } from "../models/Vehicle"
import { RecycleBin } from "../models/RecycleBin"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

type LeanVehicle = {
  _id: unknown
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
}

function publicVehicle(v: IVehicle | LeanVehicle) {
  return {
    id: String(v._id),
    name: v.name,
    description: v.description,
    seats: v.seats,
    bags: v.bags,
    perKm: v.perKm,
    baseFare: v.baseFare,
    eta: v.eta,
    ac: v.ac,
    image: v.image,
    active: v.active,
  }
}

export const listVehicles = asyncHandler(async (_req, res) => {
  const vehicles = (await Vehicle.find().sort({ createdAt: -1 }).lean()) as LeanVehicle[]
  res.json({ success: true, data: { vehicles: vehicles.map(publicVehicle) } })
})

export const listActiveVehicles = asyncHandler(async (_req, res) => {
  const vehicles = (await Vehicle.find({ active: true }).sort({ createdAt: -1 }).lean()) as LeanVehicle[]
  res.json({ success: true, data: { vehicles: vehicles.map(publicVehicle) } })
})

export const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = (await Vehicle.findById(req.params.id).lean()) as LeanVehicle | null
  if (!vehicle) throw new ApiError(404, "Vehicle not found")
  res.json({ success: true, data: { vehicle: publicVehicle(vehicle) } })
})

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body)
  res.status(201).json({ success: true, data: { vehicle: publicVehicle(vehicle) } })
})

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!vehicle) throw new ApiError(404, "Vehicle not found")
  res.json({ success: true, data: { vehicle: publicVehicle(vehicle) } })
})

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id)
  if (!vehicle) throw new ApiError(404, "Vehicle not found")

  const { _id, ...rest } = vehicle.toObject()
  await RecycleBin.create({
    sourceCollection: "vehicles",
    itemId: String(_id),
    data: { ...rest, _id: String(_id) },
  })

  res.json({ success: true, data: { id: String(vehicle._id) } })
})
