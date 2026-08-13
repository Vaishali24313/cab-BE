import { Router } from "express"

import * as tourPackage from "../controllers/tourPackage.controller"

const router = Router()

router.get("/", tourPackage.listPackages)
router.get("/:id", tourPackage.getPackage)

export default router
