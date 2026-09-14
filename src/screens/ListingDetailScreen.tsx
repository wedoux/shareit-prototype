import { Link, useParams } from 'react-router-dom'
import { photoBlockGradient } from '../lib/colorFromId'
import { areaDisplayLabel, formatShortDate, rentLabel } from '../lib/format'
import { ageLabel, daysUntilExpiry, isExpired } from '../lib/freshness'
import { combineListings, findListingById } from '../lib/listings'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'
import { useLister } from '../state/ListerContext'
import type { Language, Listing, ListingAttributeKey } from '../types'

const ATTRIBUTE_KEYS: ListingAttributeKey[] = ['pets', 'smoking', 'couples', 'students']

function HeroPhoto({ listing, lang }: { listing: Listing; lang: Language }) {
  const t = strings[lang].results.card
  const count = listing.photos.length

  if (count === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-border bg-stale-bg">
        <span className="text-sm text-ink-muted">{t.noPhotos}</span>
      </div>
    )
  }

  return (
    <div
      className="relative flex h-40 w-full items-end justify-end rounded-lg p-2"
      style={{ backgroundImage: photoBlockGradient(listing.id) }}
    >
      <span className="rounded-full bg-black/40 px-2 py-1 text-xs font-medium text-white">
        {t.photoCount(count)}
      </span>
    </div>
  )
}

/** Missing data, never hidden — always "not specified" plus a way to ask (§3a.3). */
function NotSpecified({ listingId, lang }: { listingId: string; lang: Language }) {
  const t = strings[lang]
  return (
    <span className="text-ink-muted">
      {t.common.notSpecified} ·{' '}
      <Link to={`/wall/${listingId}`} className="underline">
        {t.detail.askTheLister}
      </Link>
    </span>
  )
}

export function ListingDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const demo = useDemoControls()
  const lister = useLister()
  const now = demo.now
  const t = strings[demo.language]

  const listing = findListingById(combineListings(lister.postedListing), id ?? '')

  if (!listing) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col gap-3 p-4">
        <p className="text-sm text-ink-muted">{t.results.zeroResults}</p>
        <Link to="/results" className="text-sm underline">
          {t.common.backToResults}
        </Link>
      </main>
    )
  }

  const expired = isExpired(listing, now)
  const daysLeft = daysUntilExpiry(listing, now)

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-4">
      <HeroPhoto listing={listing} lang={demo.language} />

      <div>
        <h1 className="text-xl font-semibold">{areaDisplayLabel(listing.area, demo.language)}</h1>
        <p className="text-base font-medium text-ink-muted">{rentLabel(listing, demo.language)}</p>
        <p className="text-sm text-ink-muted">{ageLabel(listing, demo.language, now)}</p>
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-3 border-b border-border py-2">
          <dt className="text-ink-muted">{t.detail.availableFromLabel}</dt>
          <dd>{formatShortDate(listing.availableFrom, demo.language)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border py-2">
          <dt className="text-ink-muted">{t.detail.durationLabel}</dt>
          <dd>
            {t.results.card.months(listing.minStayMonths)} –{' '}
            {listing.maxStayMonths == null ? t.detail.maxStayIndefinite : t.results.card.months(listing.maxStayMonths)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border py-2">
          <dt className="text-ink-muted">{t.detail.typeLabel}</dt>
          <dd>{t.detail.roomType[listing.roomType]}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border py-2">
          <dt className="text-ink-muted">{t.detail.flatmatesLabel}</dt>
          <dd>
            {listing.flatmatesCount == null ? (
              <NotSpecified listingId={listing.id} lang={demo.language} />
            ) : (
              listing.flatmatesCount
            )}
          </dd>
        </div>
        {ATTRIBUTE_KEYS.map((key) => (
          <div key={key} className="flex justify-between gap-3 border-b border-border py-2">
            <dt className="text-ink-muted">{t.detail.attributeLabels[key]}</dt>
            <dd>
              {listing.attributes[key] == null ? (
                <NotSpecified listingId={listing.id} lang={demo.language} />
              ) : listing.attributes[key] ? (
                t.detail.attributeYes
              ) : (
                t.detail.attributeNo
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <h2 className="mb-1 text-sm font-medium">{t.detail.descriptionLabel}</h2>
        <p className="text-sm text-ink-muted">{listing.description}</p>
      </div>

      <p className={`text-sm font-medium ${expired ? 'text-expiring' : 'text-ink-muted'}`}>
        {expired ? t.detail.expiredAgo(Math.abs(daysLeft)) : t.detail.expiresIn(daysLeft)}
      </p>

      <Link
        to={`/wall/${listing.id}`}
        className="rounded-md bg-accent px-4 py-2.5 text-center text-sm font-semibold text-accent-ink"
      >
        {t.detail.revealCta}
      </Link>
    </main>
  )
}
