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
    entry: {
      title: 'Βρες δωμάτιο',
      areaLabel: 'Περιοχή',
      budgetLabel: 'Προϋπολογισμός (μηνιαίως)',
      budgetPlaceholder: 'π.χ. 350',
      billsIncludedToggle: 'Να περιλαμβάνει λογαριασμούς',
      minStayLabel: 'Ελάχιστη διαμονή (μήνες)',
      maxStayLabel: 'Μέγιστη διαμονή (μήνες)',
      freeTextLabel: 'Κάτι άλλο;',
      freeTextPlaceholder: 'π.χ. κοντά στο μετρό, φοιτητικό',
      submit: 'Αναζήτηση',
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
      // areaLabel arrives pre-formed per language — "στου Ζωγράφου" (el) or "Zografou" (en).
      countInArea: (count: number, areaLabel: string) => `${count} δωμάτια ${areaLabel}`,
      // Used until the Entry screen supplies a real area filter (build order §9, step 5).
      countTotal: (count: number) => `${count} διαθέσιμα δωμάτια`,
      thinSupplyNote: 'Δεν είναι πολλά ακόμα.',
      zeroResults: 'Καμία διαθέσιμη αγγελία αυτή τη στιγμή.',
      sort: {
        label: 'Ταξινόμηση',
        recency: 'Πιο πρόσφατα',
        price: 'Τιμή',
        duration: 'Διάρκεια',
      },
      card: {
        billsIncluded: 'με λογαριασμούς',
        billsExcluded: 'χωρίς λογαριασμούς',
        availableFrom: (date: string) => `Διαθέσιμο από ${date}`,
        durationOpenEnded: (min: string) => `από ${min}`,
        durationRange: (min: string, max: string) => `${min}–${max}`,
        months: (n: number) => (n === 1 ? '1 μήνα' : `${n} μήνες`),
        noPhotos: 'Χωρίς φωτογραφίες',
        photoCount: (n: number) => (n === 1 ? '1 φωτογραφία' : `${n} φωτογραφίες`),
        seededBadge: 'Από την ομάδα',
        matchBadge: (pct: number) => `${pct}% ταίριασμα`,
        matchBadgeSubtext: 'Φάση 2 — δεν έχει χτιστεί, δεν έχει επικυρωθεί',
      },
    },
    preferencePass: {
      sheetHeadline: (count: number, areaLabel: string) =>
        `${count} δωμάτια ${areaLabel}. Τρεις ερωτήσεις και θα δεις αυτά που αξίζει να ανοίξεις.`,
      // No area filter applied yet (Entry may not have set one) — same pitch, no place name.
      sheetHeadlineGeneric: (count: number) =>
        `${count} διαθέσιμα δωμάτια. Τρεις ερωτήσεις και θα δεις αυτά που αξίζει να ανοίξεις.`,
      questions: {
        billsIncluded: 'Το ενοίκιο να περιλαμβάνει λογαριασμούς;',
        maxFlatmates: 'Θα έμενες με πάνω από δύο άτομα;',
        earliestMove: 'Πότε είναι το νωρίτερο που θα μετακόμιζες;',
      },
      yes: 'Ναι',
      no: 'Όχι',
      earliestOptions: {
        asap: 'Άμεσα',
        thisMonth: 'Μέσα στον μήνα',
        flexible: 'Είμαι ευέλικτος/η',
      },
      skip: 'Παράλειψη',
      escapeHatch: 'Απλά θέλω να δω',
      matchHeader: (matching: number, total: number) =>
        `${matching} από ${total} δωμάτια ταιριάζουν με ό,τι μας είπες`,
      showMatches: 'εμφάνιση όσων ταιριάζουν',
      inlinePromptExample: 'Αυτό το διαμέρισμα έχει κήπο. Σε νοιάζει αυτό;',
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
    entry: {
      title: 'Find a room',
      areaLabel: 'Area',
      budgetLabel: 'Budget (per month)',
      budgetPlaceholder: 'e.g. 350',
      billsIncludedToggle: 'Must include bills',
      minStayLabel: 'Minimum stay (months)',
      maxStayLabel: 'Maximum stay (months)',
      freeTextLabel: 'Anything else?',
      freeTextPlaceholder: 'e.g. near the metro, student-friendly',
      submit: 'Search',
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
      countInArea: (count: number, areaLabel: string) => `${count} rooms in ${areaLabel}`,
      countTotal: (count: number) => `${count} rooms available`,
      thinSupplyNote: 'That is not many yet.',
      zeroResults: 'No listings available right now.',
      sort: {
        label: 'Sort',
        recency: 'Most recent',
        price: 'Price',
        duration: 'Duration',
      },
      card: {
        billsIncluded: 'bills included',
        billsExcluded: 'bills excluded',
        availableFrom: (date: string) => `Available from ${date}`,
        durationOpenEnded: (min: string) => `from ${min}`,
        durationRange: (min: string, max: string) => `${min}–${max}`,
        months: (n: number) => (n === 1 ? '1 month' : `${n} months`),
        noPhotos: 'No photos',
        photoCount: (n: number) => (n === 1 ? '1 photo' : `${n} photos`),
        seededBadge: 'Posted by the team',
        matchBadge: (pct: number) => `${pct}% match`,
        matchBadgeSubtext: 'Phase 2 — not built, not validated',
      },
    },
    preferencePass: {
      sheetHeadline: (count: number, areaLabel: string) =>
        `${count} rooms in ${areaLabel}. Three questions and you'll see the ones worth opening.`,
      sheetHeadlineGeneric: (count: number) =>
        `${count} rooms available. Three questions and you'll see the ones worth opening.`,
      questions: {
        billsIncluded: 'Bills included in the rent?',
        maxFlatmates: 'Would you share with more than two people?',
        earliestMove: 'Earliest you’d move?',
      },
      yes: 'Yes',
      no: 'No',
      earliestOptions: {
        asap: 'As soon as possible',
        thisMonth: 'Within the month',
        flexible: "I'm flexible",
      },
      skip: 'Skip',
      escapeHatch: 'Just let me look',
      matchHeader: (matching: number, total: number) =>
        `${matching} of ${total} rooms match what you've told us`,
      showMatches: 'show matches',
      inlinePromptExample: 'This flat has a garden. Does that matter to you?',
    },
  },
} satisfies Record<Language, unknown>

export const meta = {
  demoPanel: {
    title: 'Demo controls',
    hint: 'Ctrl/⌘ + Shift + D to toggle',
    supply: { label: 'Supply', cold: 'Thin', full: 'Liquid' },
    freshness: { label: 'Freshness', on: 'Expiry on', off: 'Expiry off' },
    profile: { label: 'Profile', empty: 'Empty', partial: 'Partial', complete: 'Complete' },
    matching: { label: 'Matching', off: 'Off', preview: 'Preview' },
    language: { label: 'Language', el: 'Greek', en: 'English' },
  },
}
