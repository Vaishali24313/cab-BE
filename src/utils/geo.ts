import type { ILocationInfo } from "../models/CustomerSession"

const LOCAL_IPS = new Set([
  "::1",
  "::ffff:127.0.0.1",
  "127.0.0.1",
  "localhost",
])

function isLocal(ip: string): boolean {
  if (LOCAL_IPS.has(ip)) return true
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true
  return false
}

export function clientIp(req: { headers: Record<string, unknown>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers["x-forwarded-for"]
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim()
  }
  const realIp = req.headers["x-real-ip"]
  if (typeof realIp === "string" && realIp.length > 0) {
    return realIp.trim()
  }
  return req.socket?.remoteAddress ?? ""
}

export async function geoFromIp(ip?: string): Promise<ILocationInfo> {
  if (!ip || isLocal(ip)) {
    return {}
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country,lat,lon`,
      { signal: controller.signal }
    )
    clearTimeout(timer)
    if (!res.ok) return {}

    const data = (await res.json()) as {
      status?: string
      city?: string
      regionName?: string
      country?: string
      lat?: number
      lon?: number
    }
    if (data.status !== "success") return {}

    return {
      ...(data.city ? { city: data.city } : {}),
      ...(data.regionName ? { region: data.regionName } : {}),
      ...(data.country ? { country: data.country } : {}),
      ...(typeof data.lat === "number" ? { lat: data.lat } : {}),
      ...(typeof data.lon === "number" ? { lon: data.lon } : {}),
    }
  } catch {
    return {}
  }
}
