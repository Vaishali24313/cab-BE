import { model, models, Schema, type Document, type Model } from "mongoose"

export interface IUser extends Document {
  name: string
  email?: string
  phone?: string
  passwordHash?: string
  googleId?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  role: "user" | "admin"
  otp?: {
    codeHash: string
    expiresAt: Date
    attempts: number
  }
  resetPasswordHash?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otp: {
      codeHash: { type: String },
      expiresAt: { type: Date },
      attempts: { type: Number, default: 0 },
    },
    resetPasswordHash: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  (models.User as Model<IUser> | undefined) ?? model<IUser>("User", userSchema)
