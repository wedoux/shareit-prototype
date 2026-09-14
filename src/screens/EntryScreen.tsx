import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AREAS } from '../data/areas'
import { entryFiltersToParams, type EntryFilters } from '../lib/entryFilters'
import { strings } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'

const inputClass = 'rounded-md border border-border bg-white px-3 py-2 text-sm'

export function EntryScreen() {
  const demo = useDemoControls()
  const navigate = useNavigate()
  const t = strings[demo.language].entry

  const [areas, setAreas] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [billsRequired, setBillsRequired] = useState(false)
  const [minStay, setMinStay] = useState('')
  const [maxStay, setMaxStay] = useState('')
  const [query, setQuery] = useState('')

  function toggleArea(name: string) {
    setAreas((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const filters: EntryFilters = {
      areas,
      budget: budget ? Number(budget) : null,
      billsRequired,
      minStay: minStay ? Number(minStay) : null,
      maxStay: maxStay ? Number(maxStay) : null,
      query,
    }
    navigate(`/results?${entryFiltersToParams(filters).toString()}`)
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-5 p-4">
      <h1 className="text-lg font-semibold">{t.title}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">{t.areaLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <button
                key={area.name}
                type="button"
                aria-pressed={areas.includes(area.name)}
                onClick={() => toggleArea(area.name)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  areas.includes(area.name) ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-sm font-medium">
            {t.budgetLabel}
          </label>
          <input
            id="budget"
            type="number"
            inputMode="numeric"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={t.budgetPlaceholder}
            className={inputClass}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={billsRequired} onChange={(e) => setBillsRequired(e.target.checked)} />
            {t.billsIncludedToggle}
          </label>
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
          <label htmlFor="query" className="text-sm font-medium">
            {t.freeTextLabel}
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.freeTextPlaceholder}
            className={inputClass}
          />
        </div>

        <button type="submit" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink">
          {t.submit}
        </button>
      </form>
    </main>
  )
}
