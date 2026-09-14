// A curated set of hues, not the full wheel, so a page of cards reads as one
// deliberate set rather than a random confetti of colour.
const HUES = [12, 28, 145, 200, 265, 330]

function hashString(value: string): number {
  let hash = 0
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash
}

/** Deterministic from the listing id — same listing always gets the same block. */
export function photoBlockGradient(id: string): string {
  const hue = HUES[hashString(id) % HUES.length]
  return `linear-gradient(135deg, hsl(${hue} 60% 62%), hsl(${(hue + 30) % 360} 55% 42%))`
}
