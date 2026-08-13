import { CustomerSession, type ICustomerSession } from "../models/CustomerSession"
import { User } from "../models/User"
import { asyncHandler } from "../utils/asyncHandler"

type LeanSession = {
  _id: unknown
  user: { _id: unknown }[]
  name: string
  email?: string
  phone?: string
  loginMethod: ICustomerSession["loginMethod"]
  device: ICustomerSession["device"]
  location: ICustomerSession["location"]
  ip?: string
  createdAt: Date
}

function publicSession(session: LeanSession) {
  return {
    id: String(session._id),
    name: session.name,
    email: session.email ?? undefined,
    phone: session.phone ?? undefined,
    loginMethod: session.loginMethod,
    device: session.device,
    location: session.location,
    ip: session.ip,
    loginAt:
      session.createdAt instanceof Date
        ? session.createdAt.toISOString()
        : session.createdAt,
  }
}

export const listCustomers = asyncHandler(async (_req, res) => {
  const sessions = (await CustomerSession.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$user",
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
  ])) as LeanSession[]

  const userIds = sessions
    .map((s) => s.user[0]?._id)
    .filter((id): id is NonNullable<typeof id> => Boolean(id))

  const users = await User.find({ _id: { $in: userIds } }).select(
    "_id role createdAt"
  )
  const userById = new Map(users.map((u) => [String(u._id), u]))

  const customers = sessions.map((s) => {
    const base = publicSession(s)
    const uid = s.user[0]?._id ? String(s.user[0]._id) : ""
    const userDoc = userById.get(uid)
    return {
      ...base,
      id: uid || base.id,
      role: userDoc?.role ?? "user",
      joinedAt: userDoc?.createdAt ? userDoc.createdAt.toISOString() : null,
    }
  })

  res.json({ success: true, data: { customers } })
})

export const listSessions = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const sessions = await CustomerSession.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  res.json({
    success: true,
    data: {
      sessions: sessions.map((s) =>
        publicSession({
          _id: s._id,
          user: s.user ? [{ _id: s.user }] : [],
          name: s.name,
          email: s.email,
          phone: s.phone,
          loginMethod: s.loginMethod,
          device: s.device,
          location: s.location,
          ip: s.ip,
          createdAt: s.createdAt,
        })
      ),
    },
  })
})
