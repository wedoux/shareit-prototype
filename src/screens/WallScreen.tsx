import { Link, useParams } from 'react-router-dom'
import { combineListings, findListingById } from '../lib/listings'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'
import { useLister } from '../state/ListerContext'

/**
 * The only sign-in gate in the seeker journey (§3a.4) — one screen, one
 * reason, one provider. No profile step, no onboarding, no welcome tour.
 */
export function WallScreen() {
  const { id } = useParams<{ id: string }>()
  const demo = useDemoControls()
  const lister = useLister()
  const t = strings[demo.language].wall

  const listing = findListingById(combineListings(lister.postedListing), id ?? '')
  if (!listing) return null

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-lg font-semibold">{t.title}</h1>
      <p className="text-sm text-ink-muted">{t.reason}</p>
      <Link
        to={`/revealed/${listing.id}`}
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink"
      >
        {t.googleSignIn}
      </Link>
    </main>
  )
}
