import jwt from "jsonwebtoken"

import { env } from "../config/env"
import type { IUser } from "../models/User"

export interface JwtPayload {
  userId: string
  role: string
}

export function signToken(user: Pick<IUser, "_id" | "role">): string {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  )
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}
