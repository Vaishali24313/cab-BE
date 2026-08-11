import bcrypt from "bcryptjs"
import mongoose from "mongoose"

import { env } from "../config/env"
import { User } from "../models/User"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cabtourist.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123"

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log("Connected to MongoDB")

    const existing = await User.findOne({ email: ADMIN_EMAIL })
    if (existing) {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`)
    } else {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
      await User.create({
        name: "CabTourist Admin",
        email: ADMIN_EMAIL,
        passwordHash,
        role: "admin",
        isEmailVerified: true,
      })
      console.log(`Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
    }

    const adminCount = await User.countDocuments({ role: "admin" })
    const userCount = await User.countDocuments()
    console.log(`Admin accounts: ${adminCount}, total users: ${userCount}`)

    await mongoose.disconnect()
    console.log("Seeding complete")
  } catch (err) {
    console.error("Seed failed:", err)
    process.exit(1)
  }
}

seed()
