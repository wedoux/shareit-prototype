import { sortByRecency } from './freshness'
import type { Listing } from '../types'

export type SortKey = 'recency' | 'price' | 'duration'

export function sortListings(listings: Listing[], sort: SortKey): Listing[] {
  switch (sort) {
    case 'recency':
      return sortByRecency(listings)
    case 'price':
      return [...listings].sort((a, b) => a.rent - b.rent)
    case 'duration':
      // Shortest minimum commitment first — the more flexible listing, surfaced first.
      return [...listings].sort((a, b) => a.minStayMonths - b.minStayMonths)
  }
}
