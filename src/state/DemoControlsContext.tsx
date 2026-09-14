import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type {
  ClockSetting,
  Language,
  PreferenceAnswers,
  PreferenceAnswerValue,
  PreferenceQuestionId,
  ProfilePreset,
  SupplyLevel,
} from '../types'

const DAY_MS = 24 * 60 * 60 * 1000

/** Days added to real time for each Clock setting (§6, added with the lister strand). */
const CLOCK_OFFSET_DAYS: Record<ClockSetting, number> = {
  today: 0,
  day12: 12,
  day15: 15,
}

const UNANSWERED: PreferenceAnswers = {
  billsIncluded: { state: 'unanswered' },
  maxFlatmates: { state: 'unanswered' },
  earliestMove: { state: 'unanswered' },
}

/** Canned states for the Profile demo control (§6) — a quick way to show the room the two ends. */
const PRESET_ANSWERS: Record<ProfilePreset, { answers: PreferenceAnswers; dismissed: boolean }> = {
  empty: { answers: UNANSWERED, dismissed: false },
  partial: {
    answers: {
      billsIncluded: { state: 'answered', value: true },
      maxFlatmates: { state: 'unanswered' },
      earliestMove: { state: 'unanswered' },
    },
    dismissed: false,
  },
  complete: {
    answers: {
      billsIncluded: { state: 'answered', value: true },
      maxFlatmates: { state: 'answered', value: false },
      earliestMove: { state: 'answered', value: 'thisMonth' },
    },
    dismissed: true,
  },
}

type DemoControlsValue = {
  panelOpen: boolean
  togglePanel: () => void

  supply: SupplyLevel
  setSupply: (value: SupplyLevel) => void

  freshnessEnabled: boolean
  setFreshnessEnabled: (value: boolean) => void

  matchingPreview: boolean
  setMatchingPreview: (value: boolean) => void

  language: Language
  setLanguage: (value: Language) => void

  /** The reference "now" every freshness helper and screen should use instead of Date.now(). */
  clock: ClockSetting
  setClock: (value: ClockSetting) => void
  now: number

  // The preference pass (§5b) shares this context rather than owning its own —
  // the brief calls for it to be "driven by the same context as everything else".
  profilePreset: ProfilePreset
  applyProfilePreset: (preset: ProfilePreset) => void
  preferenceAnswers: PreferenceAnswers
  passDismissed: boolean
  answerQuestion: (id: PreferenceQuestionId, value: PreferenceAnswerValue) => void
  skipQuestion: (id: PreferenceQuestionId) => void
  dismissPass: () => void
  /** The escape hatch (§5b): "leaves the full list" — discards any answers, not just the sheet. */
  justLookDismiss: () => void
}

const DemoControlsContext = createContext<DemoControlsValue | null>(null)

export function DemoControlsProvider({ children }: { children: ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(true)
  const [supply, setSupply] = useState<SupplyLevel>('full')
  const [freshnessEnabled, setFreshnessEnabled] = useState(true)
  const [matchingPreview, setMatchingPreview] = useState(false)
  const [language, setLanguage] = useState<Language>('el')
  const [clock, setClock] = useState<ClockSetting>('today')

  const [profilePreset, setProfilePreset] = useState<ProfilePreset>('empty')
  const [preferenceAnswers, setPreferenceAnswers] = useState<PreferenceAnswers>(UNANSWERED)
  const [passDismissed, setPassDismissed] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isToggleCombo = (event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'd'
      if (isToggleCombo) {
        event.preventDefault()
        setPanelOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo<DemoControlsValue>(
    () => ({
      panelOpen,
      togglePanel: () => setPanelOpen((open) => !open),
      supply,
      setSupply,
      freshnessEnabled,
      setFreshnessEnabled,
      matchingPreview,
      setMatchingPreview,
      language,
      setLanguage,
      clock,
      setClock,
      now: Date.now() + CLOCK_OFFSET_DAYS[clock] * DAY_MS,
      profilePreset,
      applyProfilePreset: (preset) => {
        const canned = PRESET_ANSWERS[preset]
        setProfilePreset(preset)
        setPreferenceAnswers(canned.answers)
        setPassDismissed(canned.dismissed)
      },
      preferenceAnswers,
      passDismissed,
      // Manual interaction with the real pass doesn't try to keep `profilePreset`
      // in sync — it's a panel convenience, not a source of truth once someone
      // has actually answered a question by hand.
      answerQuestion: (id, value) =>
        setPreferenceAnswers((prev) => ({ ...prev, [id]: { state: 'answered', value } })),
      skipQuestion: (id) =>
        setPreferenceAnswers((prev) => ({ ...prev, [id]: { state: 'skipped' } })),
      dismissPass: () => setPassDismissed(true),
      justLookDismiss: () => {
        setPreferenceAnswers(UNANSWERED)
        setPassDismissed(true)
      },
    }),
    [panelOpen, supply, freshnessEnabled, matchingPreview, language, clock, profilePreset, preferenceAnswers, passDismissed],
  )

  return <DemoControlsContext.Provider value={value}>{children}</DemoControlsContext.Provider>
}

export function useDemoControls(): DemoControlsValue {
  const context = useContext(DemoControlsContext)
  if (!context) throw new Error('useDemoControls must be used within a DemoControlsProvider')
  return context
}
