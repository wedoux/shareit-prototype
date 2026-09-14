import { ageLabel, isExpiring } from '../lib/freshness'
import { durationLabel, formatShortDate, rentLabel } from '../lib/format'
import { photoBlockGradient } from '../lib/colorFromId'
import { matchScoreStub } from '../lib/matching'
import { strings } from '../strings'
import type { Language, Listing } from '../types'

function PhotoThumb({ listing, lang }: { listing: Listing; lang: Language }) {
  const t = strings[lang].results.card
  const count = listing.photos.length

  if (count === 0) {
    return (
      <div
        className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-stale-bg p-1 text-center"
        aria-label={t.noPhotos}
      >
        <span className="text-[10px] leading-tight text-ink-muted">{t.noPhotos}</span>
      </div>
    )
  }

  return (
    <div
      className="relative h-[4.5rem] w-[4.5rem] shrink-0 rounded-md"
      style={{ backgroundImage: photoBlockGradient(listing.id) }}
      aria-label={t.photoCount(count)}
    >
      <span className="absolute bottom-1 right-1 rounded bg-black/40 px-1 text-[10px] font-medium text-white">
        {count}
      </span>
    </div>
  )
}

export function ListingCard({
  listing,
  lang,
  matchingPreview,
  freshnessEnabled,
  now,
}: {
  listing: Listing
  lang: Language
  matchingPreview: boolean
  /** When false, simulates "what every failed competitor shipped" — nothing ever looks stale. */
  freshnessEnabled: boolean
  /** Epoch ms — computed once per render pass by the caller, so every card in a list agrees on "now". */
  now: number
}) {
  const t = strings[lang]
  const expiring = freshnessEnabled && isExpiring(listing, now)

  return (
    <article
      className={`flex gap-3 rounded-lg border p-3 ${
        expiring ? 'border-expiring-bg bg-expiring-bg/40 opacity-80' : 'border-border bg-white'
      }`}
    >
      <PhotoThumb listing={listing} lang={lang} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold">{rentLabel(listing, lang)}</p>
          <p className="shrink-0 text-xs text-ink-muted">{ageLabel(listing, lang, now)}</p>
        </div>

        <p className="text-sm">{listing.area}</p>

        <p className="text-xs text-ink-muted">
          {t.results.card.availableFrom(formatShortDate(listing.availableFrom, lang))} ·{' '}
          {durationLabel(listing, lang)}
        </p>

        {matchingPreview && (
          <p className="mt-1 text-xs">
            <span className="font-medium text-accent">
              {t.results.card.matchBadge(matchScoreStub(listing.id))}
            </span>
            <span className="ml-1 text-[10px] italic text-ink-muted">
              {t.results.card.matchBadgeSubtext}
            </span>
          </p>
        )}

        {expiring && <p className="mt-1 text-xs text-expiring">{t.freshness.expiringNote}</p>}
      </div>
    </article>
  )
}
