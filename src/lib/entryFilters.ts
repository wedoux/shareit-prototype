import type { Listing } from '../types'

export type EntryFilters = {
  areas: string[]
  budget: number | null
  billsRequired: boolean
  minStay: number | null
  maxStay: number | null
  query: string
}

export function parseEntryFilters(params: URLSearchParams): EntryFilters {
  const area = params.get('area')
  const budget = params.get('budget')
  const minStay = params.get('minStay')
  const maxStay = params.get('maxStay')

  return {
    areas: area ? area.split(',').filter(Boolean) : [],
    budget: budget ? Number(budget) : null,
    billsRequired: params.get('bills') === 'true',
    minStay: minStay ? Number(minStay) : null,
    maxStay: maxStay ? Number(maxStay) : null,
    query: params.get('q') ?? '',
  }
}

export function entryFiltersToParams(filters: EntryFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.areas.length) params.set('area', filters.areas.join(','))
  if (filters.budget != null) params.set('budget', String(filters.budget))
  if (filters.billsRequired) params.set('bills', 'true')
  if (filters.minStay != null) params.set('minStay', String(filters.minStay))
  if (filters.maxStay != null) params.set('maxStay', String(filters.maxStay))
  if (filters.query.trim()) params.set('q', filters.query.trim())
  return params
}

export function applyEntryFilters(listings: Listing[], filters: EntryFilters): Listing[] {
  const query = filters.query.trim().toLowerCase()

  return listings.filter((listing) => {
    if (filters.areas.length && !filters.areas.includes(listing.area)) return false
    if (filters.budget != null && listing.rent > filters.budget) return false
    if (filters.billsRequired && !listing.billsIncluded) return false

    // Overlap between the seeker's desired stay range and the listing's own.
    if (filters.maxStay != null && filters.maxStay < listing.minStayMonths) return false
    if (filters.minStay != null && listing.maxStayMonths != null && filters.minStay > listing.maxStayMonths) {
      return false
    }

    if (query) {
      const haystack = `${listing.description} ${listing.area}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }

    return true
  })
}
