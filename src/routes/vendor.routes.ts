import { Router } from "express"

import * as vendor from "../controllers/vendor.controller"

const router = Router()

router.get("/", vendor.listVendors)
router.get("/:id", vendor.getVendor)

export default router
