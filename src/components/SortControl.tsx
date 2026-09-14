import { strings } from '../strings'
import type { SortKey } from '../lib/sortListings'
import type { Language } from '../types'

export function SortControl({
  value,
  onChange,
  lang,
}: {
  value: SortKey
  onChange: (value: SortKey) => void
  lang: Language
}) {
  const t = strings[lang].results.sort
  const options: { value: SortKey; label: string }[] = [
    { value: 'recency', label: t.recency },
    { value: 'price', label: t.price },
    { value: 'duration', label: t.duration },
  ]

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-ink-muted">{t.label}</span>
      <div className="flex overflow-hidden rounded-md border border-border" role="group" aria-label={t.label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`px-2.5 py-1 transition-colors ${
              value === option.value ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-stale-bg'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
