# Fetch 'n' Cache

Production-oriented starter baseline for the Rick and Morty assignment app.

The Vite demo content has been removed so the repository can move straight into
the actual product work: character fetching, cache interactions, persistence,
and automated tests.

## Current baseline

- Project-specific entry screen instead of the default Vite template
- Type-aware ESLint with zero-warning enforcement
- Stricter TypeScript defaults for app and tooling configs
- Unified quality gate via `npm run check`
- Vite alias support through `@/*`

## Scripts

- `npm run dev` starts the local Vite dev server
- `npm run lint` runs ESLint with `--max-warnings=0`
- `npm run typecheck` validates the TypeScript project references
- `npm run build` typechecks first, then creates a production bundle
- `npm run check` runs the main non-test quality gates in sequence
- `npm run preview` serves the built bundle locally

## Environment

- Node.js `>=20.19.0`
- npm for dependency installation and script execution

## Next implementation targets

- `react-hook-form` for the search form
- TanStack Query for the network layer
- Zustand for cache state and persistence
- Jest + Playwright coverage for unit, integration, and e2e flows

## Repo notes

- Architecture groundwork lives in [docs/architecture/2026-04-09-fetch-n-cache-technical-foundation.md](docs/architecture/2026-04-09-fetch-n-cache-technical-foundation.md)
- Delivery scope and requirements live in [docs/tasks/2026-04-09-matic-fetch-n-cache-assignment.md](docs/tasks/2026-04-09-matic-fetch-n-cache-assignment.md)
- Initial implementation plan lives in [docs/plans/2026-04-09-fetch-n-cache-implementation.md](docs/plans/2026-04-09-fetch-n-cache-implementation.md)
