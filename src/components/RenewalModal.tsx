import { useEffect, useRef } from 'react'
import { strings } from '../strings'
import type { Language } from '../types'

/**
 * The renewal moment (§3b.8, J3) — the mechanism nobody else in the Greek
 * market has built. Day 12: is this still available? Three answers, all one
 * tap, no login — friction here destroys the freshness being sold.
 */
export function RenewalModal({
  lang,
  onRenew,
  onGone,
  onAskTomorrow,
}: {
  lang: Language
  onRenew: () => void
  onGone: () => void
  onAskTomorrow: () => void
}) {
  const t = strings[lang].renewal
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dialogRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onAskTomorrow()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onAskTomorrow])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.question}
        tabIndex={-1}
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
      >
        <p className="mb-4 text-base font-semibold">{t.question}</p>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={onRenew} className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink">
            {t.renew}
          </button>
          <button type="button" onClick={onGone} className="rounded-md border border-border px-4 py-2.5 text-sm">
            {t.gone}
          </button>
          <button type="button" onClick={onAskTomorrow} className="px-4 py-2 text-sm text-ink-muted underline">
            {t.askTomorrow}
          </button>
        </div>
      </div>
    </div>
  )
}
