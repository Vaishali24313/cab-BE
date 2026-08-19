import type { IContactMessage } from "../models/ContactMessage"
import { ContactMessage } from "../models/ContactMessage"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

type LeanMessage = {
  _id: unknown
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
}

function publicMessage(m: IContactMessage | LeanMessage) {
  return {
    id: String(m._id),
    name: m.name,
    email: m.email,
    phone: m.phone ?? "",
    subject: m.subject,
    message: m.message,
    read: m.read,
  }
}

export const createMessage = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.create(req.body)
  res.status(201).json({ success: true, data: { message: publicMessage(msg) } })
})

export const listMessages = asyncHandler(async (_req, res) => {
  const messages = (await ContactMessage.find().sort({ createdAt: -1 }).lean()) as LeanMessage[]
  res.json({ success: true, data: { messages: messages.map(publicMessage) } })
})

export const getMessage = asyncHandler(async (req, res) => {
  const msg = (await ContactMessage.findById(req.params.id).lean()) as LeanMessage | null
  if (!msg) throw new ApiError(404, "Message not found")
  res.json({ success: true, data: { message: publicMessage(msg) } })
})

export const markRead = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  )
  if (!msg) throw new ApiError(404, "Message not found")
  res.json({ success: true, data: { message: publicMessage(msg) } })
})

export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!msg) throw new ApiError(404, "Message not found")
  res.json({ success: true, data: { id: String(msg._id) } })
})
