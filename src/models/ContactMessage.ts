import { model, models, Schema, type Document, type Model } from "mongoose"

export interface IContactMessage extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 20 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

contactMessageSchema.index({ name: "text", email: "text", subject: "text", message: "text" })

export const ContactMessage: Model<IContactMessage> =
  (models.ContactMessage as Model<IContactMessage> | undefined) ??
  model<IContactMessage>("ContactMessage", contactMessageSchema)
