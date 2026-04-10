# Fetch 'n' Cache

**Live demo:** https://assignment-fetch-n-cache.vercel.app/

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-linting%20%26%20formatting-60A5FA)

A small React + TypeScript app for the Rick and Morty assignment. The user enters a character ID, the app fetches the record from the public API, and the latest results are cached locally for quick re-selection.

## Quick Start

### Requirements

- Node.js `>=20.19.0`
- npm

### Run locally

```bash
cp .env.example .env
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

## Environment variables

Copy `.env.example` to `.env` before running the app locally:

| Variable | Default | Description |
|---|---|---|
| `VITE_RICK_AND_MORTY_API_BASE_URL` | `https://rickandmortyapi.com/api` | Base URL for the Rick and Morty REST API |

The default value works out of the box. Override it only if you need to point at a different API host.

## What the app does

- Fetches a Rick and Morty character by numeric ID
- Validates the search input with `react-hook-form` and `zod`
- Reuses cached characters before making another network request
- Persists cached entries in `localStorage`
- Keeps only the latest 3 cached characters (LRU eviction)
- Expires cache entries after 24 hours (TTL)
- Lets the user re-open, remove, or clear cached characters

## Architecture

The project follows [Feature-Sliced Design (FSD)](https://feature-sliced.design/) — a methodology that organises source code into strictly ordered layers. Each layer may only import from the layers below it; importing upward is forbidden. This one-way dependency rule keeps coupling low and makes every module's role explicit.

```
app        ← bootstrapping, providers
pages      ← page composition
widgets    ← screen-level orchestration
features   ← user interaction flows
entities   ← domain models, stores, reusable domain UI
shared     ← infrastructure, API, utilities, generic UI
```

**Dependency rule:** a module in layer N may import from layer N−1 and below — never from N+1 or above.

### Layer responsibilities

| Layer | Path | Responsibility |
|---|---|---|
| `app` | `src/app` | Registers `QueryClientProvider`, global styles, app entry |
| `pages` | `src/pages` | Composes widgets into routed pages (`HomePage`) |
| `widgets` | `src/widgets` | Orchestrates features into full screen flows (`CharacterBrowser`) |
| `features` | `src/features` | Focused user interactions: search form, cache rail actions |
| `entities` | `src/entities` | `Character` domain model, `characterCacheStore`, reusable character card UI |
| `shared` | `src/shared` | `fetchCharacter` API helper, `cn` utility, env config, generic UI primitives |

### Runtime flow

1. The search form accepts a numeric character ID and validates it with `zod`.
2. `useCharacterBrowser` checks the Zustand cache first.
3. On a cache miss, TanStack Query runs the fetch in `src/shared/api/fetch-character.ts`.
4. The API response is normalised into the internal `Character` shape.
5. The result is stored in the cache, persisted to `localStorage`, and rendered.

### State and data decisions

- **TanStack Query** — request lifecycle, loading and error state for network fetches
- **Zustand** — cached characters, visible character selection, cache actions
- **localStorage** — persists the cache across page reloads
- **Cache policy** (`src/entities/character/model/cache-store.ts`) — max 3 entries, 24 h TTL, LRU eviction

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck then create a production bundle |
| `npm run preview` | Serve the production bundle locally |
| `npm run lint` | Run `biome check` in read-only mode (fails on warnings) |
| `npm run lint:fix` | Apply safe Biome fixes and organise imports |
| `npm run format` | Rewrite formatting with Biome |
| `npm run typecheck` | Validate TypeScript project references |
| `npm test` | Run the Jest unit and component test suite |
| `npm run test:watch` | Run Jest in interactive watch mode |
| `npm run test:e2e` | Run the Playwright end-to-end suite |
| `npm run knip` | Detect unused files, exports, and dependencies |
| `npm run check` | Run Biome, Knip, and the production build in sequence |

## Tooling

- **React 19 + Vite 8** — UI framework and build tooling
- **TypeScript 6** — strict static typing
- **Tailwind CSS 4** — utility-first styling
- **Zustand** — lightweight client state and localStorage persistence
- **TanStack Query** — async data fetching and request lifecycle
- **react-hook-form + zod** — form handling and schema validation
- **Biome** — linting, formatting, and import organisation
- **Jest + Testing Library** — unit and component tests
- **Playwright** — end-to-end coverage
- **Lefthook** — Git hooks (pre-commit lint + typecheck)
- **Knip** — dead code and unused dependency detection
