import { mockListings } from '../data/mockListings'
import type { Listing } from '../types'

/** The mock index plus whatever this session's lister has posted, if anything. */
export function combineListings(postedListing: Listing | null): Listing[] {
  return postedListing ? [postedListing, ...mockListings] : mockListings
}

export function findListingById(listings: Listing[], id: string): Listing | null {
  return listings.find((l) => l.id === id) ?? null
}
