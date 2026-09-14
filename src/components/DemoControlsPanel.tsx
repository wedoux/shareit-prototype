import { meta } from '../strings'
import { useDemoControls } from '../state/DemoControlsContext'
import type { ProfilePreset } from '../types'

const t = meta.demoPanel

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-white/60">{label}</span>
      <div className="flex overflow-hidden rounded-md border border-white/15" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`px-2 py-1 text-xs transition-colors ${
              value === option.value
                ? 'bg-white text-neutral-900'
                : 'bg-transparent text-white/80 hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DemoControlsPanel() {
  const demo = useDemoControls()

  if (!demo.panelOpen) {
    return (
      <button
        type="button"
        onClick={demo.togglePanel}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg"
      >
        {t.title}
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="fixed bottom-4 right-4 z-50 w-64 rounded-lg bg-neutral-900/95 p-4 text-white shadow-xl backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{t.title}</p>
          <p className="text-[11px] text-white/50">{t.hint}</p>
        </div>
        <button
          type="button"
          onClick={demo.togglePanel}
          aria-label="Close demo controls"
          className="rounded px-1.5 py-0.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <ToggleGroup
          label={t.supply.label}
          value={demo.supply}
          onChange={demo.setSupply}
          options={[
            { value: 'cold', label: t.supply.cold },
            { value: 'full', label: t.supply.full },
          ]}
        />
        <ToggleGroup
          label={t.freshness.label}
          value={demo.freshnessEnabled ? 'on' : 'off'}
          onChange={(v) => demo.setFreshnessEnabled(v === 'on')}
          options={[
            { value: 'on', label: t.freshness.on },
            { value: 'off', label: t.freshness.off },
          ]}
        />
        <ToggleGroup<ProfilePreset>
          label={t.profile.label}
          value={demo.profilePreset}
          onChange={demo.applyProfilePreset}
          options={[
            { value: 'empty', label: t.profile.empty },
            { value: 'partial', label: t.profile.partial },
            { value: 'complete', label: t.profile.complete },
          ]}
        />
        <ToggleGroup
          label={t.matching.label}
          value={demo.matchingPreview ? 'preview' : 'off'}
          onChange={(v) => demo.setMatchingPreview(v === 'preview')}
          options={[
            { value: 'off', label: t.matching.off },
            { value: 'preview', label: t.matching.preview },
          ]}
        />
        <ToggleGroup
          label={t.language.label}
          value={demo.language}
          onChange={demo.setLanguage}
          options={[
            { value: 'el', label: t.language.el },
            { value: 'en', label: t.language.en },
          ]}
        />
      </div>
    </div>
  )
}
