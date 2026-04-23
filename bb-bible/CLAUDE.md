# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Next.js dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured. There is no `npm test` command.

## Architecture

**Beautiful Bible** is a static PWA for reading the Korean Bible. There is no backend — all data is local.

### Data flow

1. `src/data/bible-books.ts` — 66-book metadata (Korean names, testament grouping)
2. `public/bible.json` — raw verse data for all 66 books
3. `src/lib/bible-parser.ts` — `groupBibleByBook()` parses the JSON into `ParsedBibleData[book][chapter][verse] = text`
4. `src/hooks/use-bible-store.ts` — Zustand store; holds the parsed data, current navigation (testament/book/chapter), and UI state (fontSize, verseNumbers toggle)
5. `src/components/VerseReader.tsx` — renders verses; delegates selection events to `src/lib/verse-selection.ts` and highlight persistence to `src/lib/highlight.ts` (localStorage key: `bb-bible-highlights`)

### Key design constraints

- **Fully client-side:** No API routes, no server actions. All state lives in the Zustand store or localStorage.
- **PWA / offline:** `next-pwa` (Workbox) generates service workers at build time. PWA manifest is at `public/manifest.json`.
- **Bottom navigation drives routing:** `src/components/ConditionalBottomNav.tsx` hides the bar on the home page; `src/components/BottomNavigation.tsx` + `src/components/TabNavigation.tsx` control testament/book/chapter selection.
- **Highlights are per-verse selections** stored as a flat map in localStorage. `src/lib/highlight.ts` is the sole read/write interface for that store.
- **Theme:** Light/dark mode is handled per-component via Tailwind classes, not a global context. VerseReader accepts a `theme` prop.
- **Path alias:** `@/*` maps to `src/*` (configured in `tsconfig.json`).

### Stack

| Tool | Version |
|------|---------|
| Next.js (App Router) | 15 |
| React | 19 |
| Zustand | 5 |
| Tailwind CSS | 4 |
| TypeScript | 5 |
| next-pwa | 5 |
| Lucide React | icons |

## Backend Plan

A Spring Boot backend is planned for this project. See `../BACKEND_PLAN.md` for the full architecture.

**Summary:** 5-phase plan — Phase 1: Bible REST API + PostgreSQL, Phase 2: JWT auth, Phase 3: highlight/preference cloud sync, Phase 4: search + reading plans + verse-of-day, Phase 5: Railway deployment.

**Key integration points:**
- `verse_key` format (`창1:1`) is identical in both frontend localStorage and backend DB — no translation needed for sync
- `public/bible.json` will be copied to `bb-bible-backend/src/main/resources/data/bible.json` for the importer
- After Phase 2: frontend should support dual-mode (guest = localStorage, authenticated = API)
- Backend project lives at `../bb-bible-backend/` (sibling of this directory)