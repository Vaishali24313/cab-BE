import mongoose from "mongoose"

import { createApp } from "./app"
import { env } from "./config/env"

async function start() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log("Connected to MongoDB")

    const app = createApp()
    app.listen(env.PORT, () => {
      console.log(`API running at http://localhost:${env.PORT}`)
    })
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
}

start()
