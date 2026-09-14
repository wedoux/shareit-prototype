import type { Language } from './types'

/**
 * All seeker-facing copy lives here — nothing hardcoded in components.
 * `meta` is the exception: it's the demo-controls panel, an internal tool for
 * the three founders, not part of the product surface, so it stays in English
 * regardless of the language toggle.
 */

export const strings = {
  el: {
    app: {
      name: 'ShareIt',
    },
    common: {
      notSpecified: 'Δεν έχει οριστεί',
      showEverything: 'εμφάνιση όλων',
    },
    freshness: {
      today: 'σήμερα',
      yesterday: 'χθες',
      daysAgo: (n: number) => `πριν από ${n} μέρες`,
      renewedToday: 'ανανεώθηκε σήμερα',
      renewedYesterday: 'ανανεώθηκε χθες',
      renewedDaysAgo: (n: number) => `ανανεώθηκε πριν από ${n} μέρες`,
      expiringNote: 'Μπορεί να μην είναι πια διαθέσιμο',
      expiredCount: (n: number) => `${n} αγγελίες έληξαν πρόσφατα`,
    },
    results: {
      countInArea: (count: number, area: string) => `${count} δωμάτια στου/στη ${area}`,
      thinSupplyNote: 'Δεν είναι πολλά ακόμα.',
      card: {
        billsIncluded: 'με λογαριασμούς',
        billsExcluded: 'χωρίς λογαριασμούς',
        availableFrom: (date: string) => `Διαθέσιμο από ${date}`,
        durationOpenEnded: (min: string) => `από ${min}`,
        durationRange: (min: string, max: string) => `${min}–${max}`,
        months: (n: number) => (n === 1 ? '1 μήνα' : `${n} μήνες`),
        noPhotos: 'Χωρίς φωτογραφίες',
        photoCount: (n: number) => (n === 1 ? '1 φωτογραφία' : `${n} φωτογραφίες`),
        matchBadge: (pct: number) => `${pct}% ταίριασμα`,
        matchBadgeSubtext: 'Φάση 2 — δεν έχει χτιστεί, δεν έχει επικυρωθεί',
      },
    },
    preferencePass: {
      sheetHeadline: (count: number, area: string) =>
        `${count} δωμάτια στου/στη ${area}. Τρεις ερωτήσεις και θα δεις αυτά που αξίζει να ανοίξεις.`,
      questions: {
        billsIncluded: 'Το ενοίκιο να περιλαμβάνει λογαριασμούς;',
        maxFlatmates: 'Θα έμενες με πάνω από δύο άτομα;',
        earliestMove: 'Πότε είναι το νωρίτερο που θα μετακόμιζες;',
      },
      skip: 'Παράλειψη',
      escapeHatch: 'Απλά θέλω να δω',
      matchHeader: (matching: number, total: number) =>
        `${matching} από ${total} δωμάτια ταιριάζουν με ό,τι μας είπες`,
      inlinePromptExample: 'Αυτό το διαμέρισμα έχει κήπο. Σε νοιάζει αυτό;',
    },
    demoPanel: {
      matchingBadge: 'Φάση 2 — δεν έχει χτιστεί, δεν έχει επικυρωθεί',
    },
  },
  en: {
    app: {
      name: 'ShareIt',
    },
    common: {
      notSpecified: 'Not specified',
      showEverything: 'show everything',
    },
    freshness: {
      today: 'today',
      yesterday: 'yesterday',
      daysAgo: (n: number) => `${n} days ago`,
      renewedToday: 'renewed today',
      renewedYesterday: 'renewed yesterday',
      renewedDaysAgo: (n: number) => `renewed ${n} days ago`,
      expiringNote: 'May no longer be available',
      expiredCount: (n: number) => `${n} listings expired recently`,
    },
    results: {
      countInArea: (count: number, area: string) => `${count} rooms in ${area}`,
      thinSupplyNote: 'That is not many yet.',
      card: {
        billsIncluded: 'bills included',
        billsExcluded: 'bills excluded',
        availableFrom: (date: string) => `Available from ${date}`,
        durationOpenEnded: (min: string) => `from ${min}`,
        durationRange: (min: string, max: string) => `${min}–${max}`,
        months: (n: number) => (n === 1 ? '1 month' : `${n} months`),
        noPhotos: 'No photos',
        photoCount: (n: number) => (n === 1 ? '1 photo' : `${n} photos`),
        matchBadge: (pct: number) => `${pct}% match`,
        matchBadgeSubtext: 'Phase 2 — not built, not validated',
      },
    },
    preferencePass: {
      sheetHeadline: (count: number, area: string) =>
        `${count} rooms in ${area}. Three questions and you'll see the ones worth opening.`,
      questions: {
        billsIncluded: 'Bills included in the rent?',
        maxFlatmates: 'Would you share with more than two people?',
        earliestMove: 'Earliest you’d move?',
      },
      skip: 'Skip',
      escapeHatch: 'Just let me look',
      matchHeader: (matching: number, total: number) =>
        `${matching} of ${total} rooms match what you've told us`,
      inlinePromptExample: 'This flat has a garden. Does that matter to you?',
    },
    demoPanel: {
      matchingBadge: 'Phase 2 — not built, not validated',
    },
  },
} satisfies Record<Language, unknown>

export const meta = {
  demoPanel: {
    title: 'Demo controls',
    hint: 'Ctrl/⌘ + Shift + D to toggle',
    supply: { label: 'Supply', cold: '6 listings', full: '40 listings' },
    freshness: { label: 'Freshness', on: 'Expiry on', off: 'Expiry off' },
    profile: { label: 'Profile', empty: 'Empty', partial: 'Partial', complete: 'Complete' },
    matching: { label: 'Matching', off: 'Off', preview: 'Preview' },
    language: { label: 'Language', el: 'Greek', en: 'English' },
  },
}
