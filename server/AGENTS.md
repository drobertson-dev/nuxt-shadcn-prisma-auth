# Server - Agents

## Structure

- `server/api/**` -> `/api/**`
- `server/routes/**` -> `/**` (no `/api` prefix)
- `server/middleware/**` -> runs on every request (do not send a response)
- `server/plugins/**` -> Nitro plugins
- `server/utils/**` -> shared server helpers (`#server/*` alias)

## Rules

- Export `defineEventHandler(...)`.
- Prefer method suffix files: `.get`, `.post`, `.put`, `.delete`, etc.
- Validate once at the edge with:
  - `readValidatedBody` (body)
  - `getValidatedQuery` (query)
  - `getValidatedRouterParams` (params)
- Use Zod v4 and `schema.safeParse` (avoid double validation).
- Throw `createError` for status errors; use `setResponseStatus` for non-200.

## Patterns

- `useRuntimeConfig(event)` for runtime env overrides.
- `event.$fetch(...)` to forward headers/context.
- `event.waitUntil(...)` for background work.
- `#server/*` alias only works inside `server/`.

## Avoid

- Wrapper handlers and redundant checks.
- Legacy handlers unless absolutely required.
