# Fetch 'n' Cache

A small React + TypeScript app for the Rick and Morty assignment. The user enters a character ID, the app fetches the record from the public API, and the latest results are cached locally for quick re-selection.

## Quick Start

### Requirements

- Node.js `>=20.19.0`
- npm

### Run locally

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173`.

### Build and verify

```bash
npm run build
npm test
npm run check
```

For Playwright e2e tests, install browsers once first:

```bash
npx playwright install
npm run test:e2e
```

## What the app does

- Fetches a Rick and Morty character by numeric ID
- Validates the search input with `react-hook-form` and `zod`
- Reuses cached characters before making another network request
- Persists cached entries in `localStorage`
- Keeps only the latest 3 cached characters
- Expires cache entries after 24 hours
- Lets the user re-open, remove, or clear cached characters

## Architecture

The project uses lightweight Feature-Sliced Design, with each layer keeping one clear responsibility:

- `src/app` bootstraps the app and registers providers such as `QueryClientProvider`
- `src/pages` contains page-level composition
- `src/widgets` contains screen-level orchestration, mainly the `CharacterBrowser` flow
- `src/features` contains focused user interactions like the search form and cache rail actions
- `src/entities` contains the character domain model, cache store, and reusable character UI
- `src/shared` contains API helpers and cross-cutting utilities

### Runtime flow

1. The search form accepts a numeric character ID and validates it with `zod`.
2. `useCharacterBrowser` checks the Zustand cache first.
3. On a cache miss, TanStack Query runs the fetch request in `src/shared/api/fetch-character.ts`.
4. The API response is normalized into the internal `Character` shape.
5. The result is stored in the cache, persisted to `localStorage`, and rendered in the main widget.

### State and data decisions

- TanStack Query handles request lifecycle and loading/error state for fetches
- Zustand stores cached characters, visible character selection, and cache actions
- `localStorage` keeps the cache between reloads
- Cache policy is defined in `src/entities/character/model/cache-store.ts`

## Scripts

- `npm run dev` starts the local Vite dev server
- `npm run lint` runs `biome check` in read-only mode and fails on warnings
- `npm run lint:fix` applies safe Biome fixes, including import organization
- `npm run format` rewrites formatting with Biome only
- `npm run typecheck` validates the TypeScript project references
- `npm test` runs the Jest test suite
- `npm run test:watch` runs Jest in watch mode
- `npm run test:e2e` runs the Playwright suite
- `npm run knip` detects unused files, exports, and dependencies
- `npm run build` typechecks first, then creates a production bundle
- `npm run check` runs Biome, Knip, and the production build in sequence
- `npm run preview` serves the built bundle locally

## Tooling

- React 19 + Vite 8
- TypeScript 6
- Tailwind CSS 4 for styling
- Biome for linting, formatting, and import organization
- Jest + Testing Library for unit and UI tests
- Playwright for end-to-end coverage

## Repo Notes

- Architecture groundwork lives in [docs/architecture/2026-04-09-fetch-n-cache-technical-foundation.md](docs/architecture/2026-04-09-fetch-n-cache-technical-foundation.md)
- Delivery scope and requirements live in [docs/tasks/2026-04-09-matic-fetch-n-cache-assignment.md](docs/tasks/2026-04-09-matic-fetch-n-cache-assignment.md)
- Initial implementation plan lives in [docs/plans/2026-04-09-fetch-n-cache-implementation.md](docs/plans/2026-04-09-fetch-n-cache-implementation.md)
