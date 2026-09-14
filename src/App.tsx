import { DemoControlsPanel } from './components/DemoControlsPanel'
import { ListingCard } from './components/ListingCard'
import { DemoControlsProvider, useDemoControls } from './state/DemoControlsContext'
import { mockListings } from './data/mockListings'
import { isExpiring } from './lib/freshness'

// Review checkpoint — the Results card in each state it needs to handle,
// before the Results screen gets built around it. Replaced once that screen
// exists (build order §9, step 4).
function CardPreview() {
  const demo = useDemoControls()
  const now = Date.now()

  const withPhotos = mockListings.find((l) => l.photos.length > 1)!
  const singlePhoto = mockListings.find((l) => l.photos.length === 1)!
  const noPhotos = mockListings.find((l) => l.photos.length === 0)!
  const expiring = mockListings.find((l) => isExpiring(l))!
  const openEndedStay = mockListings.find((l) => l.maxStayMonths === null)!

  const samples = [withPhotos, singlePhoto, noPhotos, expiring, openEndedStay]

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-6">
      <div>
        <h1 className="text-lg font-semibold">Results card — review</h1>
        <p className="text-sm text-ink-muted">
          Five states: multi-photo, single-photo, no photos, expiring (muted), open-ended stay.
          Toggle language / matching / freshness in the demo panel to see them respond live.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {samples.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            lang={demo.language}
            matchingPreview={demo.matchingPreview}
            freshnessEnabled={demo.freshnessEnabled}
            now={now}
          />
        ))}
      </div>
    </main>
  )
}

function App() {
  return (
    <DemoControlsProvider>
      <CardPreview />
      <DemoControlsPanel />
    </DemoControlsProvider>
  )
}

export default App
