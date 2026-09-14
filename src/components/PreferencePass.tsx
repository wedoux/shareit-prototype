import { useEffect, useState } from 'react'
import { filterByPreferences, hasAnyAnswer, nextUnansweredQuestion } from '../lib/preferenceFilter'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'
import type { Language, Listing, PreferenceQuestionId } from '../types'

function QuestionButtons({
  questionId,
  lang,
  onAnswer,
}: {
  questionId: PreferenceQuestionId
  lang: Language
  onAnswer: (value: boolean | string) => void
}) {
  const t = strings[lang].preferencePass

  if (questionId === 'earliestMove') {
    const options: { value: string; label: string }[] = [
      { value: 'asap', label: t.earliestOptions.asap },
      { value: 'thisMonth', label: t.earliestOptions.thisMonth },
      { value: 'flexible', label: t.earliestOptions.flexible },
    ]
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onAnswer(option.value)}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-sm hover:bg-stale-bg"
          >
            {option.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onAnswer(true)}
        className="rounded-full border border-border bg-white px-4 py-1.5 text-sm hover:bg-stale-bg"
      >
        {t.yes}
      </button>
      <button
        type="button"
        onClick={() => onAnswer(false)}
        className="rounded-full border border-border bg-white px-4 py-1.5 text-sm hover:bg-stale-bg"
      >
        {t.no}
      </button>
    </div>
  )
}

/**
 * The onboarding (§5b), and the second reason this prototype exists. Appears
 * as a non-modal sheet over Results — never a gate, browsing stays live above
 * it. The floor (below MIN_LISTINGS, don't offer to narrow) is decided by the
 * caller, which is why it isn't re-checked here.
 */
export function PreferencePass({
  listings,
  areaLabel,
  now,
}: {
  /** The pre-preference visible set (after supply + freshness) — what the sheet's count is "of". */
  listings: Listing[]
  areaLabel: string | null
  now: number
}) {
  const demo = useDemoControls()
  const [ready, setReady] = useState(false)

  // "Appears after the first results are rendered" (§5b) — not simultaneously.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const nextQuestion = nextUnansweredQuestion(demo.preferenceAnswers)

  // All three questioned (answered or skipped) — nothing left to ask, so the
  // sheet closes itself rather than sitting there empty.
  useEffect(() => {
    if (!nextQuestion && !demo.passDismissed) demo.dismissPass()
  }, [nextQuestion, demo.passDismissed, demo])

  if (!ready || demo.passDismissed || !nextQuestion) return null

  const t = strings[demo.language].preferencePass
  const answered = hasAnyAnswer(demo.preferenceAnswers)
  const matchingCount = answered ? filterByPreferences(listings, demo.preferenceAnswers, now).length : listings.length

  return (
    <div
      role="dialog"
      aria-label={t.sheetHeadlineGeneric(listings.length)}
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md flex-col gap-3 rounded-t-xl border border-b-0 border-border bg-white p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]"
    >
      <p className={`text-sm font-medium ${answered ? 'text-accent' : ''}`}>
        {answered
          ? t.matchHeader(matchingCount, listings.length)
          : areaLabel
            ? t.sheetHeadline(listings.length, areaLabel)
            : t.sheetHeadlineGeneric(listings.length)}
      </p>

      <p className="text-sm">{t.questions[nextQuestion]}</p>
      <QuestionButtons
        questionId={nextQuestion}
        lang={demo.language}
        onAnswer={(value) => demo.answerQuestion(nextQuestion, value)}
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => demo.skipQuestion(nextQuestion)}
          className="text-xs text-ink-muted underline"
        >
          {t.skip}
        </button>
        <button type="button" onClick={demo.justLookDismiss} className="text-xs text-ink-muted underline">
          {t.escapeHatch}
        </button>
      </div>
    </div>
  )
}
