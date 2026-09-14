import { DemoControlsPanel } from './components/DemoControlsPanel'
import { DemoControlsProvider, useDemoControls } from './state/DemoControlsContext'
import { mockListings } from './data/mockListings'
import { isExpired } from './lib/freshness'

// Temporary — replaced once the Results screen exists (build order §9, step 4).
// Useful for eyeballing that the demo controls actually drive state.
function ScaffoldStatus() {
  const demo = useDemoControls()
  const liveCount = mockListings.filter((l) => demo.freshnessEnabled ? !isExpired(l) : true).length

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-3 p-6 font-sans">
      <h1 className="text-lg font-semibold">ShareIt — scaffold</h1>
      <p className="text-sm text-ink-muted">
        Steps 1–3 done: tokens, strings, mock data, freshness helpers, demo controls.
        Screens come next — this view is just to confirm the wiring.
      </p>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
        <dt className="text-ink-muted">Total mock listings</dt>
        <dd>{mockListings.length}</dd>
        <dt className="text-ink-muted">Visible (freshness {demo.freshnessEnabled ? 'on' : 'off'})</dt>
        <dd>{liveCount}</dd>
        <dt className="text-ink-muted">Supply control</dt>
        <dd>{demo.supply}</dd>
        <dt className="text-ink-muted">Language</dt>
        <dd>{demo.language}</dd>
        <dt className="text-ink-muted">Profile preset</dt>
        <dd>{demo.profilePreset}</dd>
      </dl>
    </main>
  )
}

function App() {
  return (
    <DemoControlsProvider>
      <ScaffoldStatus />
      <DemoControlsPanel />
    </DemoControlsProvider>
  )
}

export default App
