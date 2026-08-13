import { Router } from "express"

import * as admin from "../controllers/admin.controller"
import * as tourPackage from "../controllers/tourPackage.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { requireAdmin } from "../middlewares/admin.middleware"
import { validate } from "../middlewares/validate.middleware"
import * as schemas from "../schemas/tourPackage.schema"

const router = Router()

router.use(authenticate, requireAdmin)

router.get("/customers", admin.listCustomers)
router.get("/sessions", admin.listSessions)

router.get("/packages", tourPackage.listPackages)
router.post(
  "/packages",
  validate(schemas.createPackageSchema),
  tourPackage.createPackage
)
router.put(
  "/packages/:id",
  validate(schemas.updatePackageSchema),
  tourPackage.updatePackage
)
router.delete("/packages/:id", tourPackage.deletePackage)

export default router
