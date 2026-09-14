import { useState } from 'react'
import { ListingCard } from '../components/ListingCard'
import { SortControl } from '../components/SortControl'
import { coldSupplyIds, mockListings } from '../data/mockListings'
import { isExpired } from '../lib/freshness'
import { sortListings, type SortKey } from '../lib/sortListings'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'

const THIN_SUPPLY_THRESHOLD = 10

export function ResultsScreen() {
  const demo = useDemoControls()
  const [sort, setSort] = useState<SortKey>('recency')
  const now = Date.now()

  // No Entry screen yet (build order §9, step 5) — scoped to the whole mock
  // index for now. Supply candidates first, then visibility: with freshness
  // off, expired listings stay in the list too — that's the point of the
  // control, showing what an index that never expires looks like.
  const candidates = demo.supply === 'cold' ? mockListings.filter((l) => coldSupplyIds.has(l.id)) : mockListings
  const visible = candidates.filter((l) => (demo.freshnessEnabled ? !isExpired(l, now) : true))
  const sorted = sortListings(visible, sort)

  const t = strings[demo.language].results

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">{t.countTotal(sorted.length)}</h1>
        <SortControl value={sort} onChange={setSort} lang={demo.language} />
      </header>

      {sorted.length === 0 ? (
        <p className="text-sm text-ink-muted">{t.zeroResults}</p>
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
        <p className="text-sm text-ink-muted">{t.thinSupplyNote}</p>
      )}
    </main>
  )
}
