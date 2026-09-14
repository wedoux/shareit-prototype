import { areaLocative } from '../data/areas'
import { strings } from '../strings'
import type { Language, Listing } from '../types'

/** "στου Ζωγράφου" (el, stored/inflected) or "Zografou" (en, no inflection needed). */
export function areaDisplayLabel(area: string, lang: Language): string {
  return lang === 'el' ? areaLocative(area) : area
}

export function formatShortDate(iso: string, lang: Language): string {
  const locale = lang === 'el' ? 'el-GR' : 'en-GB'
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(iso))
}

/** "3–6 months" or, with no cap, "from 3 months". */
export function durationLabel(listing: Listing, lang: Language): string {
  const t = strings[lang].results.card
  const min = t.months(listing.minStayMonths)
  if (listing.maxStayMonths == null) return t.durationOpenEnded(min)
  return t.durationRange(min, t.months(listing.maxStayMonths))
}

export function rentLabel(listing: Listing, lang: Language): string {
  const t = strings[lang].results.card
  const bills = listing.billsIncluded ? t.billsIncluded : t.billsExcluded
  return `€${listing.rent} · ${bills}`
}
