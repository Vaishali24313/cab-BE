import bcrypt from "bcryptjs"
import mongoose from "mongoose"

import { env } from "../config/env"
import { TourPackage } from "../models/TourPackage"
import { User } from "../models/User"
import { Vendor } from "../models/Vendor"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cabtourist.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123"

const VENDOR_SEEDS = [
  { name: "Skyline Travels", city: "Mumbai", fleet: 48, drivers: 62, rating: 4.8, revenue: 1240000, status: "active", joined: "2023-02-11" },
  { name: "Rajasthan Wheels", city: "Jaipur", fleet: 36, drivers: 44, rating: 4.7, revenue: 980000, status: "active", joined: "2023-05-19" },
  { name: "Coastal Cabs", city: "Goa", fleet: 22, drivers: 28, rating: 4.6, revenue: 610000, status: "active", joined: "2023-08-02" },
  { name: "Hill Rider Fleet", city: "Manali", fleet: 18, drivers: 21, rating: 4.5, revenue: 470000, status: "pending", joined: "2026-07-10" },
  { name: "Southern Star Mobility", city: "Bengaluru", fleet: 54, drivers: 71, rating: 4.9, revenue: 1560000, status: "active", joined: "2022-11-23" },
  { name: "Backwater Rides", city: "Kochi", fleet: 15, drivers: 19, rating: 4.4, revenue: 320000, status: "suspended", joined: "2024-01-30" },
  { name: "Capital Cabs", city: "Delhi", fleet: 61, drivers: 88, rating: 4.7, revenue: 1810000, status: "active", joined: "2022-09-14" },
]

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

    const vendorCount = await Vendor.countDocuments()
    if (vendorCount === 0) {
      await Vendor.insertMany(VENDOR_SEEDS)
      console.log(`Seeded ${VENDOR_SEEDS.length} vendors`)
    } else {
      console.log(`Vendors already seeded: ${vendorCount}`)
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
