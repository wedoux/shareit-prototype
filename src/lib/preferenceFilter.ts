import type { Listing, PreferenceAnswers, PreferenceAnswerValue, PreferenceQuestionId } from '../types'

const DAY_MS = 24 * 60 * 60 * 1000

/** Order matters — it's the order the sheet asks them in (§5b). */
export const QUESTION_ORDER: PreferenceQuestionId[] = ['billsIncluded', 'maxFlatmates', 'earliestMove']

function matchesQuestion(
  id: PreferenceQuestionId,
  listing: Listing,
  value: PreferenceAnswerValue,
  now: number,
): boolean {
  switch (id) {
    case 'billsIncluded':
      return listing.billsIncluded === value
    case 'maxFlatmates':
      // "Willing to share with more than two" imposes no ceiling; "no" caps at two.
      // An unknown flatmate count is never used to exclude a listing (§3: missing
      // fields are shown as "not specified", never treated as a silent fail).
      if (value === true) return true
      return listing.flatmatesCount == null || listing.flatmatesCount <= 2
    case 'earliestMove': {
      if (value === 'flexible') return true
      const windowDays = value === 'asap' ? 7 : 30
      return new Date(listing.availableFrom).getTime() <= now + windowDays * DAY_MS
    }
  }
}

export function filterByPreferences(listings: Listing[], answers: PreferenceAnswers, now: number): Listing[] {
  const answered = QUESTION_ORDER.filter((id) => answers[id].state === 'answered')
  if (answered.length === 0) return listings

  return listings.filter((listing) =>
    answered.every((id) => {
      const status = answers[id]
      return status.state === 'answered' && matchesQuestion(id, listing, status.value, now)
    }),
  )
}

export function hasAnyAnswer(answers: PreferenceAnswers): boolean {
  return QUESTION_ORDER.some((id) => answers[id].state === 'answered')
}

export function nextUnansweredQuestion(answers: PreferenceAnswers): PreferenceQuestionId | null {
  return QUESTION_ORDER.find((id) => answers[id].state === 'unanswered') ?? null
}
