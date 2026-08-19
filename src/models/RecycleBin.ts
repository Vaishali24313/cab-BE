import { model, models, Schema, type Document, type Model } from "mongoose"

export interface IRecycleBin extends Document {
  sourceCollection: string
  itemId: string
  data: Record<string, unknown>
  deletedAt: Date
  createdAt: Date
}

const recycleBinSchema = new Schema<IRecycleBin>(
  {
    sourceCollection: { type: String, required: true, trim: true, index: true },
    itemId: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

recycleBinSchema.index({ sourceCollection: 1, deletedAt: -1 })

export const RecycleBin: Model<IRecycleBin> =
  (models.RecycleBin as Model<IRecycleBin> | undefined) ??
  model<IRecycleBin>("RecycleBin", recycleBinSchema)
