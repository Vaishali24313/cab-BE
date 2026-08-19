import bcrypt from "bcryptjs"
import mongoose from "mongoose"

import { env } from "../config/env"
import { Booking } from "../models/Booking"
import { TourPackage } from "../models/TourPackage"
import { User } from "../models/User"
import { Vendor } from "../models/Vendor"
import { Vehicle } from "../models/Vehicle"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cabtourist.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123"

const BOOKING_SEEDS = [
  { ref: "CT-92841", customer: "Priya Sharma", phone: "9820000001", email: "priya@email.com", fromCity: "Mumbai", toCity: "Pune", tripType: "oneway", cab: "Sedan", date: "2026-07-26", time: "09:00", distanceKm: 150, amount: 2199, status: "ongoing", driver: "Ramesh K." },
  { ref: "CT-92840", customer: "Rohit Mehta", phone: "9820000002", email: "rohit.m@email.com", fromCity: "Delhi", toCity: "Jaipur", tripType: "oneway", cab: "SUV", date: "2026-07-26", time: "08:30", distanceKm: 281, amount: 3899, status: "confirmed", driver: "Suresh P." },
  { ref: "CT-92838", customer: "Ananya Rao", phone: "9820000003", email: "ananya.rao@email.com", fromCity: "Bengaluru", toCity: "Mysuru", tripType: "roundtrip", cab: "Sedan", date: "2026-07-25", time: "10:00", distanceKm: 145, amount: 2099, status: "completed", driver: "Manoj R." },
  { ref: "CT-92835", customer: "Sara Fernandes", phone: "9820000004", email: "sara.f@email.com", fromCity: "Goa", toCity: "Panaji", tripType: "airport", cab: "Hatchback", date: "2026-07-25", time: "14:00", distanceKm: 40, amount: 899, status: "completed", driver: "Anthony D." },
  { ref: "CT-92830", customer: "Vikram Singh", phone: "9820000005", email: "vikram.s@email.com", fromCity: "Chandigarh", toCity: "Manali", tripType: "oneway", cab: "SUV", date: "2026-07-24", time: "06:00", distanceKm: 310, amount: 5499, status: "cancelled", driver: "" },
  { ref: "CT-92826", customer: "Neha Gupta", phone: "9820000006", email: "neha.g@email.com", fromCity: "Delhi", toCity: "Agra", tripType: "oneway", cab: "Premium", date: "2026-07-24", time: "07:30", distanceKm: 233, amount: 4299, status: "completed", driver: "Imran S." },
  { ref: "CT-92822", customer: "Arjun Nair", phone: "9820000007", email: "arjun.n@email.com", fromCity: "Kochi", toCity: "Munnar", tripType: "oneway", cab: "SUV", date: "2026-07-23", time: "09:00", distanceKm: 130, amount: 2899, status: "completed", driver: "Biju V." },
  { ref: "CT-92819", customer: "Meera Iyer", phone: "9820000008", email: "meera.i@email.com", fromCity: "Delhi", toCity: "Shimla", tripType: "roundtrip", cab: "Sedan", date: "2026-07-23", time: "08:00", distanceKm: 342, amount: 5199, status: "pending", driver: "" },
  { ref: "CT-92815", customer: "Karan Malhotra", phone: "9820000009", email: "karan.m@email.com", fromCity: "Pune", toCity: "Mumbai", tripType: "oneway", cab: "Premium", date: "2026-07-22", time: "16:30", distanceKm: 150, amount: 2499, status: "completed", driver: "Deepak M." },
  { ref: "CT-92810", customer: "Divya Menon", phone: "9820000010", email: "divya.m@email.com", fromCity: "Jaipur", toCity: "Udaipur", tripType: "oneway", cab: "SUV", date: "2026-07-22", time: "08:00", distanceKm: 420, amount: 6299, status: "completed", driver: "Gopal S." },
]

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

const VEHICLE_SEEDS = [
  {
    name: "Hatchback",
    description: "Compact & economical for city hops",
    seats: 4,
    bags: 2,
    perKm: 11,
    baseFare: 250,
    eta: "4 min",
    ac: true,
    image: "/images/car-hatchback.jpg",
    active: true,
  },
  {
    name: "Sedan",
    description: "Comfortable rides for small families",
    seats: 4,
    bags: 3,
    perKm: 14,
    baseFare: 350,
    eta: "5 min",
    ac: true,
    image: "/images/car-sedan.jpg",
    active: true,
  },
  {
    name: "Ertiga",
    description: "Spacious MPV ideal for groups",
    seats: 6,
    bags: 4,
    perKm: 16,
    baseFare: 450,
    eta: "6 min",
    ac: true,
    image: "/images/car-ertiga.jpg",
    active: true,
  },
  {
    name: "SUV",
    description: "Spacious & sturdy for hill routes",
    seats: 6,
    bags: 4,
    perKm: 18,
    baseFare: 500,
    eta: "7 min",
    ac: true,
    image: "/images/car-suv.jpg",
    active: true,
  },
  {
    name: "Innova Crysta",
    description: "Premium MPV for family & outstation",
    seats: 7,
    bags: 5,
    perKm: 22,
    baseFare: 700,
    eta: "8 min",
    ac: true,
    image: "/images/car-innova.jpg",
    active: true,
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

    const bookingCount = await Booking.countDocuments()
    if (bookingCount === 0) {
      await Booking.insertMany(BOOKING_SEEDS)
      console.log(`Seeded ${BOOKING_SEEDS.length} bookings`)
    } else {
      console.log(`Bookings already seeded: ${bookingCount}`)
    }

    const vehicleCount = await Vehicle.countDocuments()
    if (vehicleCount === 0) {
      await Vehicle.insertMany(VEHICLE_SEEDS)
      console.log(`Seeded ${VEHICLE_SEEDS.length} vehicles`)
    } else {
      console.log(`Vehicles already seeded: ${vehicleCount}`)
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
