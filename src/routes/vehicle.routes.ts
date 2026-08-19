import { Router } from "express"

import * as vehicle from "../controllers/vehicle.controller"

const router = Router()

router.get("/", vehicle.listActiveVehicles)
router.get("/:id", vehicle.getVehicle)

export default router
