# Tests - Agents

## Stack

- Vitest + `@nuxt/test-utils`.
- Install peers if missing: `vitest`, `@vue/test-utils`, `happy-dom` (or `jsdom`).

## Structure

- `tests/unit/**` -> pure unit tests (Node env)
- `tests/nuxt/**` -> Nuxt runtime tests (`.nuxt.test.ts`)
- `tests/e2e/**` -> end-to-end tests (`@nuxt/test-utils/e2e`)

## Rules

- Do not mix runtime helpers and e2e helpers in the same file.
- Reset `useState` between tests when touching shared state.
- Keep tests isolated; avoid external network calls.

## Helpers

- `mountSuspended` / `renderSuspended`
- `mockNuxtImport`
- `registerEndpoint`

## Scripts

- `pnpm run test`
- `pnpm run test:unit`
- `pnpm run test:nuxt`
- `pnpm run test:e2e`
