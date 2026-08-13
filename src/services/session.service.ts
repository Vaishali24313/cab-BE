import type { Request } from "express"

import { CustomerSession, type IDeviceInfo, type ILocationInfo } from "../models/CustomerSession"
import type { IUser } from "../models/User"
import { parseDeviceInfo } from "../utils/device"
import { clientIp, geoFromIp } from "../utils/geo"

export type ClientDeviceMeta = {
  type?: IDeviceInfo["type"]
  browser?: string
  os?: string
  model?: string
}

export type ClientLocationMeta = {
  city?: string
  region?: string
  country?: string
  lat?: number
  lon?: number
}

export type ClientMeta = {
  device?: ClientDeviceMeta
  location?: ClientLocationMeta
}

function isClientMeta(value: unknown): value is ClientMeta {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  if (v.device !== undefined && (!v.device || typeof v.device !== "object")) return false
  if (v.location !== undefined && (!v.location || typeof v.location !== "object")) return false
  return true
}

export async function recordLogin(
  user: IUser,
  req: Request,
  loginMethod: "email" | "google" | "phone",
  clientMeta?: unknown
): Promise<void> {
  try {
    const meta = isClientMeta(clientMeta) ? clientMeta : undefined
    const ip = clientIp(req)
    const serverDevice = parseDeviceInfo(req.headers["user-agent"])
    const geo = await geoFromIp(ip)

    const device: IDeviceInfo = {
      type: meta?.device?.type ?? serverDevice.type,
      browser: meta?.device?.browser ?? serverDevice.browser,
      os: meta?.device?.os ?? serverDevice.os,
      model: meta?.device?.model ?? serverDevice.model,
    }

    const location: ILocationInfo = {
      ...geo,
      ...(meta?.location?.lat !== undefined ? { lat: meta.location.lat } : {}),
      ...(meta?.location?.lon !== undefined ? { lon: meta.location.lon } : {}),
      ...(meta?.location?.city ? { city: meta.location.city } : {}),
      ...(meta?.location?.region ? { region: meta.location.region } : {}),
      ...(meta?.location?.country ? { country: meta.location.country } : {}),
    }

    await CustomerSession.create({
      user: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loginMethod,
      userAgent: req.headers["user-agent"],
      device,
      ip,
      location,
    })
  } catch (err) {
    console.error("[session] Failed to record login:", err)
  }
}
