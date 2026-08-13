import bcrypt from "bcryptjs"
import mongoose from "mongoose"

import { env } from "../config/env"
import { TourPackage } from "../models/TourPackage"
import { User } from "../models/User"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cabtourist.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123"

const PACKAGE_SEEDS = [
  {
    title: "Ujjain Local Sightseeing",
    location: "Ujjain, Madhya Pradesh",
    image: "/images/hero-mahakal-1.jpg",
    nights: 0,
    days: 1,
    rating: 4.9,
    reviews: 612,
    fromPrice: 1499,
    highlights: ["Mahakaleshwar darshan", "Ram Ghat & Sandipani Ashram", "Private AC cab for 12 hrs"],
    tag: "Bestseller",
  },
  {
    title: "Ujjain to Indore",
    location: "Indore, Madhya Pradesh",
    image: "/images/package-heritage.png",
    nights: 0,
    days: 1,
    rating: 4.8,
    reviews: 428,
    fromPrice: 1599,
    highlights: ["Door-to-door pickup & drop", "Tolls & driver allowance included", "Flexible one-way or round trip"],
    tag: "Popular",
  },
  {
    title: "Ujjain to Omkareshwar",
    location: "Omkareshwar, Madhya Pradesh",
    image: "/images/hero-mahakal-2.jpg",
    nights: 0,
    days: 1,
    rating: 4.9,
    reviews: 305,
    fromPrice: 2599,
    highlights: ["Omkareshwar Jyotirlinga darshan", "Mamleshwar & Gauri Somnath visit", "Flexible return timing"],
    tag: "Pilgrimage",
  },
  {
    title: "Ujjain to Indore Airport",
    location: "Indore Airport, Madhya Pradesh",
    image: "/images/car-sedan.jpg",
    nights: 0,
    days: 1,
    rating: 4.8,
    reviews: 389,
    fromPrice: 1299,
    highlights: ["On-time airport pickup & drop", "Flight tracking for delays", "Help with luggage included"],
    tag: "Airport",
  },
  {
    title: "Ujjain to Khatu Shyam Ji",
    location: "Sikar, Rajasthan",
    image: "/images/package-heritage.png",
    nights: 0,
    days: 1,
    rating: 4.9,
    reviews: 174,
    fromPrice: 9999,
    highlights: ["Shyam Baba darshan", "Experienced highway drivers", "Rest stops on the way"],
    tag: "Pilgrimage",
  },
  {
    title: "Ujjain to Maa Baglamukhi",
    location: "Nalkheda, Madhya Pradesh",
    image: "/images/pujan-mahakal.jpg",
    nights: 0,
    days: 1,
    rating: 4.8,
    reviews: 216,
    fromPrice: 1999,
    highlights: ["Maa Baglamukhi darshan", "Smooth countryside route", "Round trip friendly"],
    tag: "Popular",
  },
  {
    title: "Ujjain to Sanwariya Seth",
    location: "Menar, Rajasthan",
    image: "/images/hero-mahakal-3.jpg",
    nights: 0,
    days: 1,
    rating: 4.9,
    reviews: 148,
    fromPrice: 6999,
    highlights: ["Sanwariya Seth darshan", "Comfortable highway travel", "Flexible overnight stay option"],
    tag: "Pilgrimage",
  },
]

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

    const packageCount = await TourPackage.countDocuments()
    if (packageCount === 0) {
      await TourPackage.insertMany(PACKAGE_SEEDS)
      console.log(`Seeded ${PACKAGE_SEEDS.length} tour packages`)
    } else {
      console.log(`Tour packages already seeded: ${packageCount}`)
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
