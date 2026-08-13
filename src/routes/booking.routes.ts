import { Router } from "express"

import * as booking from "../controllers/booking.controller"
import { validate } from "../middlewares/validate.middleware"
import { createBookingSchema } from "../schemas/booking.schema"

const router = Router()

router.post("/", validate(createBookingSchema), booking.createBooking)
router.get("/", booking.listMyBookings)
router.get("/:id", booking.getBooking)

export default router
