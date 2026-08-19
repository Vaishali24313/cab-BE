import { Router } from "express"

import * as contactMessage from "../controllers/contactMessage.controller"
import { validate } from "../middlewares/validate.middleware"
import * as contactMessageSchemas from "../schemas/contactMessage.schema"

const router = Router()

router.post(
  "/",
  validate(contactMessageSchemas.createContactMessageSchema),
  contactMessage.createMessage
)

export default router
