import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ListingCard } from '../components/ListingCard'
import { RenewalModal } from '../components/RenewalModal'
import { formatShortDate } from '../lib/format'
import { DAY_MS, EXPIRY_WINDOW_DAYS, daysUntilExpiry } from '../lib/freshness'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'
import { useLister } from '../state/ListerContext'
import type { ClockSetting } from '../types'

/** Day 12: is this still available? (§3b.8) — needs the Clock control to ever fire in a meeting. */
const RENEWAL_TRIGGER_DAYS_LEFT = 2

export function LiveExpiryScreen() {
  const { id } = useParams<{ id: string }>()
  const demo = useDemoControls()
  const lister = useLister()
  const navigate = useNavigate()
  const t = strings[demo.language]
  const now = demo.now

  const [identityDismissed, setIdentityDismissed] = useState(false)
  // Which Clock setting the renewal prompt was last dismissed at — comparing
  // against the current one (rather than resetting via an effect) means a
  // session dismissal doesn't survive jumping from day 12 to day 15.
  const [modalDismissedAtClock, setModalDismissedAtClock] = useState<ClockSetting | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)

  const listing = lister.postedListing?.id === id ? lister.postedListing : null

  if (!listing) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col gap-3 p-4">
        <p className="text-sm text-ink-muted">{t.renewal.goneConfirmation}</p>
        <Link to="/post" className="text-sm underline">
          {t.post.title}
        </Link>
      </main>
    )
  }

  const daysLeft = daysUntilExpiry(listing, now)
  const showRenewalModal = modalDismissedAtClock !== demo.clock && daysLeft <= RENEWAL_TRIGGER_DAYS_LEFT

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-5 p-4">
      <div>
        <h1 className="text-lg font-semibold">{t.live.title}</h1>
        <p className="text-sm text-ink-muted">{t.live.expiresOn(formatShortDate(listing.expiresAt, demo.language))}</p>
      </div>

      <p className="rounded-lg bg-stale-bg p-3 text-sm">{t.live.protectionFraming}</p>

      {confirmation && <p className="text-sm font-medium text-fresh">{confirmation}</p>}

      {!identityDismissed && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-ink-muted">{t.live.identityBannerText}</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" className="text-xs font-semibold text-accent">
              {t.live.identitySignIn}
            </button>
            <button type="button" onClick={() => setIdentityDismissed(true)} className="text-xs text-ink-muted underline">
              {t.live.identityDismiss}
            </button>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-ink-muted">{t.live.previewLabel}</p>
        <ListingCard
          listing={listing}
          lang={demo.language}
          matchingPreview={demo.matchingPreview}
          freshnessEnabled={demo.freshnessEnabled}
          now={now}
        />
      </div>

      {showRenewalModal && (
        <RenewalModal
          lang={demo.language}
          onRenew={() => {
            lister.renew(now)
            const newExpiry = new Date(now + EXPIRY_WINDOW_DAYS * DAY_MS).toISOString()
            setConfirmation(t.renewal.renewedConfirmation(formatShortDate(newExpiry, demo.language)))
            setModalDismissedAtClock(demo.clock)
          }}
          onGone={() => {
            lister.markGone()
            navigate('/post')
          }}
          onAskTomorrow={() => setModalDismissedAtClock(demo.clock)}
        />
      )}
    </main>
  )
}
