/**
 * INVENTED DATA — for prototyping only. Not research.
 *
 * Every listing here is generated. None of it comes from a real lister, a real
 * flat, or a real conversation. Rents, descriptions, contact details and areas
 * are plausible, not observed. Do not quote this file as evidence of anything
 * about the Athens market — that's what `research/` is for.
 *
 * The incompleteness is deliberate (brief §7): about half have no photos, a
 * third are missing maxStayMonths, most have two or fewer attributes set, and
 * descriptions vary from a terse line to a paragraph. A prototype with clean
 * data lies about the problem this product exists to solve.
 */
import { DAY_MS, EXPIRY_WINDOW_DAYS } from '../lib/freshness'
import { chance, intBetween, mulberry32, pick } from '../lib/rng'
import type { Listing, ListingAttributeKey } from '../types'
import { AREAS } from './areas'

const SEED = 20260914
const LISTING_COUNT = 40

// Colloquial, uneven fragments — mixed and matched, not every listing gets all of them.
const OPENERS = [
  'Ψάχνουμε συγκάτοικο/α για δίχωρο κοντά στη γραμμή του λεωφορείου.',
  'Δωμάτιο σε διαμέρισμα, ήσυχη γειτονιά, ιδανικό για φοιτητή/τρια.',
  'Φεύγει ο συγκάτοικος τέλος του μήνα, ψάχνουμε αντικαταστάτη.',
  'Μονόχωρο, μικρό αλλά φωτεινό, ρετιρέ.',
  'Room available, ανακαινισμένο μπάνιο, κοντά σε σούπερ μάρκετ.',
  'Δωμάτιο σε φοιτητικό σπίτι, ζούμε ήδη 3 άτομα, ψάχνουμε 4ο.',
]

const MIDDLES = [
  'Δίπλα στη στάση, 5 λεπτά με τα πόδια.',
  'Το σπίτι έχει μπαλκόνι και πλυντήριο.',
  'Χωρίς ασανσέρ, 3ος όροφος.',
  'Καλοδιατηρημένο κτίριο, θέρμανση πετρελαίου.',
  'Υπάρχει χώρος για γραφείο.',
  '',
  '',
]

const CLOSERS = [
  'Γράψτε μου για περισσότερες πληροφορίες.',
  'Στείλτε μήνυμα, απαντάω γρήγορα.',
  'Διαθέσιμο από τέλος του μήνα.',
  'Προτιμάμε φοιτητή/τρια αλλά όχι απαραίτητο.',
  '',
  '',
]

const ATTRIBUTE_KEYS: ListingAttributeKey[] = ['pets', 'smoking', 'couples', 'students']

function toIso(date: Date): string {
  return date.toISOString()
}

function makeListing(index: number, random: () => number): Listing {
  const area = pick(random, AREAS)
  const id = `L${String(index + 1).padStart(3, '0')}`

  // Spread postings across the last 25 days so some are naturally already
  // past their 14-day expiry — needed for the freshness demo control to have
  // something real to reveal when expiry is switched off.
  const postedDaysAgo = intBetween(random, 0, 25)
  const postedAt = new Date(Date.now() - postedDaysAgo * DAY_MS)

  const wasRenewed = chance(random, 0.3) && postedDaysAgo > 3
  const renewedAt = wasRenewed
    ? new Date(postedAt.getTime() + intBetween(random, 2, Math.max(2, postedDaysAgo - 1)) * DAY_MS)
    : null

  const expiryBase = renewedAt ?? postedAt
  const expiresAt = new Date(expiryBase.getTime() + EXPIRY_WINDOW_DAYS * DAY_MS)

  const hasPhotos = chance(random, 0.5)
  const photoCount = hasPhotos ? intBetween(random, 1, 5) : 0

  const hasMaxStay = !chance(random, 1 / 3)
  const minStayMonths = pick(random, [3, 4, 6, 6, 9, 12])
  const maxStayMonths = hasMaxStay ? minStayMonths + pick(random, [0, 3, 6, 12]) : null

  const attributeCount = pick(random, [0, 0, 1, 1, 2])
  const attributes: Partial<Record<ListingAttributeKey, boolean>> = {}
  const shuffledKeys = [...ATTRIBUTE_KEYS].sort(() => random() - 0.5)
  for (let i = 0; i < attributeCount; i++) {
    attributes[shuffledKeys[i]] = chance(random, 0.7)
  }

  const description = [pick(random, OPENERS), pick(random, MIDDLES), pick(random, CLOSERS)]
    .filter(Boolean)
    .join(' ')

  const contactMethod = pick(random, ['whatsapp', 'phone', 'email'] as const)
  const contactValue =
    contactMethod === 'email'
      ? `room${index + 1}@example.gr`
      : `69${intBetween(random, 10000000, 99999999)}`

  return {
    id,
    area: area.name,
    coords: area.coords,
    rent: intBetween(random, 25, 50) * 10,
    billsIncluded: chance(random, 0.45),
    availableFrom: toIso(new Date(Date.now() + intBetween(random, -5, 40) * DAY_MS)),
    minStayMonths,
    maxStayMonths,
    roomType: chance(random, 0.7) ? 'private' : 'shared',
    flatmatesCount: chance(random, 0.85) ? intBetween(random, 1, 4) : null,
    description,
    photos: Array.from({ length: photoCount }, (_, i) => `${id}-photo-${i + 1}`),
    postedAt: toIso(postedAt),
    renewedAt: renewedAt ? toIso(renewedAt) : null,
    expiresAt: toIso(expiresAt),
    seeded: chance(random, 0.18),
    contact: { method: contactMethod, value: contactValue },
    attributes,
  }
}

function generateListings(): Listing[] {
  const random = mulberry32(SEED)
  return Array.from({ length: LISTING_COUNT }, (_, i) => makeListing(i, random))
}

/** Generated once, at module load — deterministic, so the demo never reshuffles on refresh. */
export const mockListings: Listing[] = generateListings()

/** Backs the Supply demo control (§6): the same 6 listings every time, not a random slice. */
export const coldSupplyIds: ReadonlySet<string> = new Set(mockListings.slice(0, 6).map((l) => l.id))
