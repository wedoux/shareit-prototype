import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AREAS } from '../data/areas'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'
import { useLister } from '../state/ListerContext'

const inputClass = 'rounded-md border border-border bg-white px-3 py-2 text-sm'

/**
 * One screen, six fields (§3b.6): area, rent + bills, available from, min/max
 * stay, free text. Publish-then-identity — the listing exists the moment this
 * submits; there is no sign-in step here at all, only on the next screen, and
 * skipping it there still leaves the listing live.
 */
export function PostRoomScreen() {
  const demo = useDemoControls()
  const lister = useLister()
  const navigate = useNavigate()
  const t = strings[demo.language].post

  const [area, setArea] = useState<string | null>(null)
  const [rent, setRent] = useState('')
  const [billsIncluded, setBillsIncluded] = useState(false)
  const [availableFrom, setAvailableFrom] = useState('')
  const [minStay, setMinStay] = useState('')
  const [maxStay, setMaxStay] = useState('')
  const [description, setDescription] = useState('')

  const canSubmit = area && rent && availableFrom && minStay && description.trim()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!area || !rent || !availableFrom || !minStay || !description.trim()) return

    const listing = lister.postListing(
      {
        area,
        rent: Number(rent),
        billsIncluded,
        availableFrom: new Date(availableFrom).toISOString(),
        minStayMonths: Number(minStay),
        maxStayMonths: maxStay ? Number(maxStay) : null,
        description: description.trim(),
      },
      demo.now,
    )
    navigate(`/live/${listing.id}`)
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-5 p-4">
      <h1 className="text-lg font-semibold">{t.title}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">{t.areaLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <button
                key={a.name}
                type="button"
                aria-pressed={area === a.name}
                onClick={() => setArea(a.name)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  area === a.name ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink'
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="rent" className="text-sm font-medium">
            {t.rentLabel}
          </label>
          <input
            id="rent"
            type="number"
            inputMode="numeric"
            min={0}
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            placeholder={t.rentPlaceholder}
            className={inputClass}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={billsIncluded} onChange={(e) => setBillsIncluded(e.target.checked)} />
            {t.billsIncludedToggle}
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="availableFrom" className="text-sm font-medium">
            {t.availableFromLabel}
          </label>
          <input
            id="availableFrom"
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="minStay" className="text-sm font-medium">
              {t.minStayLabel}
            </label>
            <input
              id="minStay"
              type="number"
              min={0}
              value={minStay}
              onChange={(e) => setMinStay(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="maxStay" className="text-sm font-medium">
              {t.maxStayLabel}
            </label>
            <input
              id="maxStay"
              type="number"
              min={0}
              value={maxStay}
              onChange={(e) => setMaxStay(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            {t.descriptionLabel}
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink disabled:opacity-40"
        >
          {t.submit}
        </button>
      </form>
    </main>
  )
}
