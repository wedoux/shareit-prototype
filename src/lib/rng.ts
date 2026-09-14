/**
 * Seeded PRNG so the mock data — and therefore the demo — is identical on every
 * load. A prototype that reshuffles itself on refresh is useless in a meeting.
 */
export function mulberry32(seed: number) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]
}

export function intBetween(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min
}

export function chance(random: () => number, probability: number): boolean {
  return random() < probability
}
