import { Router } from "express"

import * as admin from "../controllers/admin.controller"
import * as tourPackage from "../controllers/tourPackage.controller"
import * as vendor from "../controllers/vendor.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { requireAdmin } from "../middlewares/admin.middleware"
import { validate } from "../middlewares/validate.middleware"
import * as packageSchemas from "../schemas/tourPackage.schema"
import * as vendorSchemas from "../schemas/vendor.schema"

const router = Router()

router.use(authenticate, requireAdmin)

router.get("/customers", admin.listCustomers)
router.get("/sessions", admin.listSessions)

router.get("/packages", tourPackage.listPackages)
router.post(
  "/packages",
  validate(packageSchemas.createPackageSchema),
  tourPackage.createPackage
)
router.put(
  "/packages/:id",
  validate(packageSchemas.updatePackageSchema),
  tourPackage.updatePackage
)
router.delete("/packages/:id", tourPackage.deletePackage)

router.get("/vendors", vendor.listVendors)
router.post(
  "/vendors",
  validate(vendorSchemas.createVendorSchema),
  vendor.createVendor
)
router.put(
  "/vendors/:id",
  validate(vendorSchemas.updateVendorSchema),
  vendor.updateVendor
)
router.delete("/vendors/:id", vendor.deleteVendor)

export default router
