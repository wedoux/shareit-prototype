# ShareIt — seeker journey prototype

A throwaway, front-end-only prototype of one journey in ShareIt: a seeker with
no account finds a room and reveals the contact. Built to stimulate a
conversation between three founders currently describing two different
products, and to put in front of real seekers and listers as research.

It is not the product. All data is invented — see the notice in
`src/data/mockListings.ts`.

## Stack

Vite + React + TypeScript + Tailwind v4. Self-hosted Inter (Fontsource).
Deploys to GitHub Pages.

## Run it

```
npm install
npm run dev
```

## Demo controls

A floating panel (toggle with `Cmd/Ctrl + Shift + D`) switches supply,
freshness, profile, matching-preview and language during a live session —
see the panel itself for the current states.
