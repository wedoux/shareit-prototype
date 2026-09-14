import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ListingCard } from '../components/ListingCard'
import { PreferencePass } from '../components/PreferencePass'
import { SortControl } from '../components/SortControl'
import { coldSupplyIds, mockListings } from '../data/mockListings'
import { applyEntryFilters, parseEntryFilters } from '../lib/entryFilters'
import { areaDisplayLabel } from '../lib/format'
import { isExpired } from '../lib/freshness'
import { filterByPreferences, hasAnyAnswer } from '../lib/preferenceFilter'
import { sortListings, type SortKey } from '../lib/sortListings'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'

const THIN_SUPPLY_THRESHOLD = 10

// Three questions to narrow three rooms is nonsense — below this, the pass
// doesn't appear at all and Results just shows everything. Filtering is
// something you offer when there's something to filter. Tune here.
const MIN_LISTINGS_FOR_PREFERENCE_PASS = 8

export function ResultsScreen() {
  const demo = useDemoControls()
  const [searchParams] = useSearchParams()
  const [sort, setSort] = useState<SortKey>('recency')
  const [showAll, setShowAll] = useState(false)
  const now = Date.now()

  const entryFilters = parseEntryFilters(searchParams)

  // Supply candidates, then visibility: with freshness off, expired listings
  // stay in the list too — that's the point of the control, showing what an
  // index that never expires looks like (and it grows, not just goes stale —
  // that growth is the commercial temptation that produced every dead index).
  const candidates = demo.supply === 'cold' ? mockListings.filter((l) => coldSupplyIds.has(l.id)) : mockListings
  const withFreshness = candidates.filter((l) => (demo.freshnessEnabled ? !isExpired(l, now) : true))
  const visible = applyEntryFilters(withFreshness, entryFilters)

  const showPass = visible.length >= MIN_LISTINGS_FOR_PREFERENCE_PASS
  const preferenceActive = hasAnyAnswer(demo.preferenceAnswers) && !showAll
  const narrowed = preferenceActive ? filterByPreferences(visible, demo.preferenceAnswers, now) : visible
  const sorted = sortListings(narrowed, sort)

  const t = strings[demo.language]
  const singleAreaLabel = entryFilters.areas.length === 1 ? areaDisplayLabel(entryFilters.areas[0], demo.language) : null

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-4 pb-56">
      <header className="flex items-start justify-between gap-3">
        <h1 className="text-lg font-semibold">
          {hasAnyAnswer(demo.preferenceAnswers) ? (
            <>
              {t.preferencePass.matchHeader(narrowed.length, visible.length)}{' '}
              <button type="button" onClick={() => setShowAll((v) => !v)} className="text-sm font-normal underline">
                {showAll ? t.preferencePass.showMatches : t.common.showEverything}
              </button>
            </>
          ) : singleAreaLabel ? (
            t.results.countInArea(visible.length, singleAreaLabel)
          ) : (
            t.results.countTotal(visible.length)
          )}
        </h1>
        <SortControl value={sort} onChange={setSort} lang={demo.language} />
      </header>

      {sorted.length === 0 ? (
        <p className="text-sm text-ink-muted">{t.results.zeroResults}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((listing) => (
            <li key={listing.id}>
              <ListingCard
                listing={listing}
                lang={demo.language}
                matchingPreview={demo.matchingPreview}
                freshnessEnabled={demo.freshnessEnabled}
                now={now}
              />
            </li>
          ))}
        </ul>
      )}

      {sorted.length > 0 && sorted.length < THIN_SUPPLY_THRESHOLD && (
        <p className="text-sm text-ink-muted">{t.results.thinSupplyNote}</p>
      )}

      {showPass && <PreferencePass listings={visible} areaLabel={singleAreaLabel} now={now} />}
    </main>
  )
}
