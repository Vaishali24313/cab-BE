import type { DeviceType, IDeviceInfo } from "../models/CustomerSession"

export function parseDeviceInfo(userAgent?: string): IDeviceInfo {
  const ua = userAgent ?? ""

  let type: DeviceType = "desktop"
  if (/tablet|ipad/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
    type = "tablet"
  } else if (/mobi|iphone|ipod|android/i.test(ua)) {
    type = "mobile"
  }

  let browser = "Unknown"
  if (/edg\//i.test(ua)) browser = "Edge"
  else if (/opr\/|opera/i.test(ua)) browser = "Opera"
  else if (/crios|chrome/i.test(ua)) browser = "Chrome"
  else if (/fxios|firefox/i.test(ua)) browser = "Firefox"
  else if (/safari/i.test(ua)) browser = "Safari"
  else if (/msie|trident/i.test(ua)) browser = "Internet Explorer"

  let os = "Unknown"
  if (/windows/i.test(ua)) os = "Windows"
  else if (/iphone|ipod/i.test(ua)) os = "iOS"
  else if (/ipad/i.test(ua)) os = "iPadOS"
  else if (/mac os x/i.test(ua)) os = "macOS"
  else if (/android/i.test(ua)) os = "Android"
  else if (/cros/i.test(ua)) os = "Chrome OS"
  else if (/linux/i.test(ua)) os = "Linux"

  let model = ""
  const iphone = ua.match(/iPhone OS (\d+_\d+)/)
  if (iphone) model = `iPhone (iOS ${iphone[1].replace("_", ".")})`
  const ipad = ua.match(/iPad.*?OS (\d+_\d+)/)
  if (ipad) model = `iPad (iPadOS ${ipad[1].replace("_", ".")})`

  return { type, browser, os, ...(model ? { model } : {}) }
}
