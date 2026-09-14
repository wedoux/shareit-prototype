/**
 * University catchments named in the brief. `locative` is the correct
 * Greek "in/at" form stored as-is — Greek place names inflect irregularly
 * by gender and number, so this is a lookup, never composed at runtime.
 */
export const AREAS: { name: string; coords: [number, number]; locative: string }[] = [
  { name: 'Ζωγράφου', coords: [37.9756, 23.7658], locative: 'στου Ζωγράφου' },
  { name: 'Ιλίσια', coords: [37.9784, 23.7669], locative: 'στα Ιλίσια' },
  { name: 'Γουδί', coords: [37.9808, 23.7581], locative: 'στο Γουδί' },
  { name: 'Καισαριανή', coords: [37.9661, 23.7461], locative: 'στην Καισαριανή' },
  { name: 'Παγκράτι', coords: [37.9667, 23.7486], locative: 'στο Παγκράτι' },
  { name: 'Κυψέλη', coords: [38.0022, 23.7364], locative: 'στην Κυψέλη' },
  { name: 'Αμπελόκηποι', coords: [37.9897, 23.7581], locative: 'στους Αμπελόκηπους' },
  { name: 'Εξάρχεια', coords: [37.9885, 23.7333], locative: 'στα Εξάρχεια' },
]

const LOCATIVE_BY_NAME = new Map(AREAS.map((a) => [a.name, a.locative]))

export function areaLocative(name: string): string {
  const locative = LOCATIVE_BY_NAME.get(name)
  if (!locative) throw new Error(`No locative form stored for area "${name}"`)
  return locative
}
