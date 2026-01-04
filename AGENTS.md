# Global - Agents

## UI + components

- Use shadcn components first; avoid wrapper components unless they add real behavior.
- Component names are primary-first: `Button`, `ButtonOutline`, `Dropdown`, `DropdownMenu`.
- Prefer slots, provide/inject, or composables over prop drilling.

## State + data

- Shared state lives in `useState` with the key defined outside the composable (global/shared).
- For state initialization, use `callOnce` at the page/layout level.
- Avoid Pinia unless truly necessary.

## Validation + errors

- Validate once at the edge; avoid repeated checks and defensive wrapper chains.
- Throw `createError` for status errors; keep error handling local.

## Tooling

- Format: `pnpm run format` / `pnpm run format:check` (oxfmt)
- Lint: `pnpm run lint` / `pnpm run lint:fix` (oxlint)
- Full pass: `pnpm run life`

## Auth (Better Auth)

### Server

- Better Auth config: `server/utils/auth.ts`
- Mounted route: `server/api/auth/[...all].ts` (catch-all under `/api/auth/*`)
- Prisma singleton: `server/utils/db.ts`
- Session check example: `server/api/me.get.ts`

### Client

- Auth client: `app/lib/auth-client.ts` (Vue client + email OTP client plugin)
- SSR session: `await authClient.useSession(useFetch)`
- Protected pages: middleware `auth` (`app/middleware/auth.ts`)

### Enabled auth methods

- Email + password
- Email OTP (Resend) for sign-in, email verification, password reset
- OAuth: Google + GitHub (enabled only when env vars exist)

### Env vars

- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `RESEND_API_KEY`, `RESEND_FROM`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `DATABASE_URL`

### DB schema

- Run: `npx @better-auth/cli@latest generate`
- If the CLI can't find the config, use: `npx @better-auth/cli@latest generate --config ./server/utils/auth.ts`
- Then: `pnpm prisma migrate dev --name better-auth`
- Then: `pnpm prisma generate`

# ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.
