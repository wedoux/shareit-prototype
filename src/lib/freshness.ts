import { strings } from '../strings'
import type { Language, Listing } from '../types'

export const DAY_MS = 24 * 60 * 60 * 1000
/** 14 days from the later of postedAt/renewedAt (§5) — the one number the whole prototype turns on. */
export const EXPIRY_WINDOW_DAYS = 14
const EXPIRING_WINDOW_DAYS = 3
const FRESH_WINDOW_DAYS = 2

/** Whole days from `fromMs` to `toMs`, both epoch milliseconds. */
function daysBetweenMs(fromMs: number, toMs: number): number {
  return Math.floor((toMs - fromMs) / DAY_MS)
}

function daysSince(isoDate: string, now: number): number {
  return daysBetweenMs(new Date(isoDate).getTime(), now)
}

/** True once a listing is past its expiry — these are never shown, freshness toggle aside. */
export function isExpired(listing: Listing, now: number = Date.now()): boolean {
  return new Date(listing.expiresAt).getTime() <= now
}

/** True inside the last 3 days before expiry — renders muted, "may no longer be available". */
export function isExpiring(listing: Listing, now: number = Date.now()): boolean {
  if (isExpired(listing, now)) return false
  const daysLeft = daysBetweenMs(now, new Date(listing.expiresAt).getTime())
  return daysLeft <= EXPIRING_WINDOW_DAYS
}

export type FreshnessState = 'fresh' | 'normal' | 'expiring'

/**
 * The three visible states a card needs (posted/renewed yesterday must not
 * look identical to three weeks ago). `freshnessEnabled` is the demo control —
 * off means "what every failed competitor shipped," so nothing ever reads as
 * fresh or expiring, only normal.
 */
export function freshnessState(
  listing: Listing,
  freshnessEnabled: boolean,
  now: number = Date.now(),
): FreshnessState {
  if (!freshnessEnabled) return 'normal'
  if (isExpiring(listing, now)) return 'expiring'
  const reference = listing.renewedAt ?? listing.postedAt
  if (daysSince(reference, now) <= FRESH_WINDOW_DAYS) return 'fresh'
  return 'normal'
}

/**
 * "Posted 3 days ago" / "Renewed yesterday" — renewal always wins the label,
 * since it's the more recent, more relevant event.
 */
export function ageLabel(listing: Listing, lang: Language, now: number = Date.now()): string {
  const t = strings[lang].freshness
  const reference = listing.renewedAt ?? listing.postedAt
  const days = daysSince(reference, now)
  const isRenewal = Boolean(listing.renewedAt)

  if (days <= 0) return isRenewal ? t.renewedToday : t.today
  if (days === 1) return isRenewal ? t.renewedYesterday : t.yesterday
  return isRenewal ? t.renewedDaysAgo(days) : t.daysAgo(days)
}

/**
 * Whole days until expiry (negative once past it) — the exact number the
 * detail screen's expiry line states plainly, per §3a.3.
 */
export function daysUntilExpiry(listing: Listing, now: number = Date.now()): number {
  return daysBetweenMs(now, new Date(listing.expiresAt).getTime())
}

/** The timestamp default "recency" sort orders by — renewal counts as fresh as a new post. */
export function recencyTimestamp(listing: Listing): number {
  return new Date(listing.renewedAt ?? listing.postedAt).getTime()
}

export function sortByRecency(listings: Listing[]): Listing[] {
  return [...listings].sort((a, b) => recencyTimestamp(b) - recencyTimestamp(a))
}
