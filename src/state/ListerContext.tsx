import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { AREAS } from '../data/areas'
import { DAY_MS, EXPIRY_WINDOW_DAYS } from '../lib/freshness'
import type { Listing } from '../types'

export type PostRoomFields = {
  area: string
  rent: number
  billsIncluded: boolean
  availableFrom: string
  minStayMonths: number
  maxStayMonths: number | null
  description: string
}

type ListerValue = {
  /** Out of scope (§4): one listing per session, no management, no editing. */
  postedListing: Listing | null
  postListing: (fields: PostRoomFields, now: number) => Listing
  renew: (now: number) => void
  markGone: () => void
}

const ListerContext = createContext<ListerValue | null>(null)

export function ListerProvider({ children }: { children: ReactNode }) {
  const [postedListing, setPostedListing] = useState<Listing | null>(null)

  const value = useMemo<ListerValue>(
    () => ({
      postedListing,
      postListing: (fields, now) => {
        const area = AREAS.find((a) => a.name === fields.area)
        const postedAt = new Date(now).toISOString()
        const listing: Listing = {
          id: `L-POSTED-${now}`,
          area: fields.area,
          coords: area?.coords ?? [37.9838, 23.7275],
          rent: fields.rent,
          billsIncluded: fields.billsIncluded,
          availableFrom: fields.availableFrom,
          minStayMonths: fields.minStayMonths,
          maxStayMonths: fields.maxStayMonths,
          // Not collected on the 6-field Post screen (§3b.6) — six fields
          // means six fields. Mocked so the type is satisfiable, never shown.
          roomType: 'private',
          flatmatesCount: null,
          description: fields.description,
          photos: [],
          postedAt,
          renewedAt: null,
          expiresAt: new Date(now + EXPIRY_WINDOW_DAYS * DAY_MS).toISOString(),
          seeded: false,
          contact: { method: 'whatsapp', value: '69XXXXXXXX' },
          attributes: {},
        }
        setPostedListing(listing)
        return listing
      },
      renew: (now) =>
        setPostedListing((prev) =>
          prev
            ? { ...prev, renewedAt: new Date(now).toISOString(), expiresAt: new Date(now + EXPIRY_WINDOW_DAYS * DAY_MS).toISOString() }
            : prev,
        ),
      // "Archives, drops from the index immediately" (J3 step 4) — one listing
      // per session, so closing it just clears it.
      markGone: () => setPostedListing(null),
    }),
    [postedListing],
  )

  return <ListerContext.Provider value={value}>{children}</ListerContext.Provider>
}

export function useLister(): ListerValue {
  const context = useContext(ListerContext)
  if (!context) throw new Error('useLister must be used within a ListerProvider')
  return context
}
