import { ageLabel, freshnessState } from '../lib/freshness'
import { areaDisplayLabel, durationLabel, formatShortDate, rentLabel } from '../lib/format'
import { photoBlockGradient } from '../lib/colorFromId'
import { matchScoreStub } from '../lib/matching'
import { strings } from '../strings'
import type { FreshnessState } from '../lib/freshness'
import type { Language, Listing } from '../types'

function PhotoThumb({ listing, lang }: { listing: Listing; lang: Language }) {
  const t = strings[lang].results.card
  const count = listing.photos.length

  if (count === 0) {
    return (
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-stale-bg p-1 text-center"
        aria-label={t.noPhotos}
      >
        <span className="text-xs leading-tight text-ink-muted">{t.noPhotos}</span>
      </div>
    )
  }

  return (
    <div
      className="relative h-24 w-24 shrink-0 rounded-md"
      style={{ backgroundImage: photoBlockGradient(listing.id) }}
      aria-label={t.photoCount(count)}
    >
      <span className="absolute bottom-1 right-1 rounded bg-black/40 px-1.5 py-0.5 text-xs font-medium text-white">
        {count}
      </span>
    </div>
  )
}

const AGE_COLOR: Record<FreshnessState, string> = {
  fresh: 'text-fresh',
  normal: 'text-ink',
  expiring: 'text-expiring',
}

const CARD_SURFACE: Record<FreshnessState, string> = {
  fresh: 'border-border bg-white',
  normal: 'border-border bg-white',
  expiring: 'border-expiring bg-expiring-bg',
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
  const state = freshnessState(listing, freshnessEnabled, now)

  return (
    <article className={`flex gap-3 rounded-lg border p-3 ${CARD_SURFACE[state]}`}>
      <PhotoThumb listing={listing} lang={lang} />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-base font-semibold">{areaDisplayLabel(listing.area, lang)}</p>
          {listing.seeded && (
            <span className="shrink-0 rounded bg-seeded-bg px-1.5 py-0.5 text-[11px] font-medium text-seeded">
              {t.results.card.seededBadge}
            </span>
          )}
        </div>

        <p className="text-sm text-ink-muted">{rentLabel(listing, lang)}</p>

        <p className={`text-base font-semibold ${AGE_COLOR[state]}`}>{ageLabel(listing, lang, now)}</p>

        <p className="text-xs text-ink-muted">
          {t.results.card.availableFrom(formatShortDate(listing.availableFrom, lang))} ·{' '}
          {durationLabel(listing, lang)}
        </p>

        {state === 'expiring' && (
          <p className="mt-1 text-xs font-medium text-expiring">{t.freshness.expiringNote}</p>
        )}

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
      </div>
    </article>
  )
}
