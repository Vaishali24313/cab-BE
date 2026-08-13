import { model, models, Schema, type Document, type Model } from "mongoose"

export interface ITourPackage extends Document {
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
  createdAt: Date
  updatedAt: Date
}

const tourPackageSchema = new Schema<ITourPackage>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    image: { type: String, default: "/placeholder.svg", maxlength: 500 },
    nights: { type: Number, required: true, min: 0, default: 0 },
    days: { type: Number, required: true, min: 1, default: 1 },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviews: { type: Number, min: 0, default: 0 },
    fromPrice: { type: Number, required: true, min: 0 },
    highlights: { type: [String], default: [] },
    tag: { type: String, trim: true, maxlength: 40 },
  },
  { timestamps: true }
)

tourPackageSchema.index({ title: "text", location: "text", tag: "text" })

export const TourPackage: Model<ITourPackage> =
  (models.TourPackage as Model<ITourPackage> | undefined) ??
  model<ITourPackage>("TourPackage", tourPackageSchema)
