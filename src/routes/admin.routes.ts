import { Router } from "express"

import * as admin from "../controllers/admin.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { requireAdmin } from "../middlewares/admin.middleware"

const router = Router()

router.use(authenticate, requireAdmin)

router.get("/customers", admin.listCustomers)
router.get("/sessions", admin.listSessions)

export default router
