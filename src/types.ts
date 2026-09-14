export type ContactMethod = 'phone' | 'whatsapp' | 'email'

export type ListingAttributeKey = 'pets' | 'smoking' | 'couples' | 'students'

/** A listing is a place, not a person — the thing this prototype exists to argue for. */
export type Listing = {
  id: string
  area: string
  coords: [number, number]
  rent: number
  billsIncluded: boolean
  availableFrom: string // ISO date
  minStayMonths: number
  maxStayMonths: number | null // null = indefinite
  roomType: 'private' | 'shared'
  flatmatesCount: number | null
  description: string // free text, Greek, messy, realistic
  photos: string[] // often empty; length is what matters, not content
  postedAt: string // ISO datetime
  renewedAt: string | null // ISO datetime
  expiresAt: string // ISO datetime — 14 days from the later of postedAt/renewedAt
  seeded: boolean // concierge-seeded, permanently flagged
  contact: { method: ContactMethod; value: string }
  attributes: Partial<Record<ListingAttributeKey, boolean>>
}

export type Language = 'el' | 'en'

export type SupplyLevel = 'cold' | 'full' // 6 listings / 40 listings

/** The three questions in the preference pass (§5b). Order matters — it's the order they're asked in. */
export type PreferenceQuestionId = 'billsIncluded' | 'maxFlatmates' | 'earliestMove'

export type PreferenceAnswerValue = boolean | string

export type PreferenceQuestionStatus =
  | { state: 'unanswered' }
  | { state: 'answered'; value: PreferenceAnswerValue }
  | { state: 'skipped' }

export type PreferenceAnswers = Record<PreferenceQuestionId, PreferenceQuestionStatus>

/** The demo-panel preset for §6's Profile control. Drives PreferenceAnswers, not a separate flag. */
export type ProfilePreset = 'empty' | 'partial' | 'complete'
