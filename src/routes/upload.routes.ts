import multer from "multer"
import path from "path"
import { Router } from "express"
import { authenticate } from "../middlewares/auth.middleware"
import { requireAdmin } from "../middlewares/admin.middleware"

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"))
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, name)
  },
})

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase())
  const mimeOk = allowed.test(file.mimetype)
  if (extOk && mimeOk) {
    cb(null, true)
  } else {
    cb(new Error("Only image files (jpg, png, gif, webp, svg) are allowed"))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

const router = Router()

router.use(authenticate, requireAdmin)

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "No file uploaded" })
    return
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ success: true, data: { url } })
})

export default router
