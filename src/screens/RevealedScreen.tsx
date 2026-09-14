import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { combineListings, findListingById } from '../lib/listings'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'
import { useLister } from '../state/ListerContext'
import type { Listing } from '../types'

function contactHref(listing: Listing): string {
  switch (listing.contact.method) {
    case 'whatsapp':
      return `https://wa.me/30${listing.contact.value.replace(/\D/g, '')}`
    case 'phone':
      return `tel:+30${listing.contact.value.replace(/\D/g, '')}`
    case 'email':
      return `mailto:${listing.contact.value}`
  }
}

export function RevealedScreen() {
  const { id } = useParams<{ id: string }>()
  const demo = useDemoControls()
  const lister = useLister()
  const t = strings[demo.language].revealed
  const [replied, setReplied] = useState<string | null>(null)

  const listing = findListingById(combineListings(lister.postedListing), id ?? '')
  if (!listing) return null

  const contactLabel =
    listing.contact.method === 'whatsapp' ? t.openWhatsapp : listing.contact.method === 'phone' ? t.call : t.email

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-5 p-4">
      <h1 className="text-lg font-semibold">{t.title}</h1>

      <div className="rounded-lg border border-border bg-white p-4">
        <p className="text-sm text-ink-muted">{listing.contact.value}</p>
        <a
          href={contactHref(listing)}
          className="mt-3 inline-block rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink"
        >
          {contactLabel}
        </a>
      </div>

      {/* Shown but not built (§3a.5) — a real version would fire track() here. */}
      <div className="rounded-lg border border-dashed border-border p-4">
        <p className="mb-2 text-sm font-medium">{t.replyHookQuestion}</p>
        {replied ? (
          <p className="text-sm text-ink-muted">{t.replyThanks}</p>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setReplied('yes')}
              className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-stale-bg"
            >
              {t.replyYes}
            </button>
            <button
              type="button"
              onClick={() => setReplied('no')}
              className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-stale-bg"
            >
              {t.replyNo}
            </button>
            <button
              type="button"
              onClick={() => setReplied('not-yet')}
              className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-stale-bg"
            >
              {t.replyNotYet}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
