# Nuxt Shadcn Prisma Auth Starter

A production-ready Nuxt 4 starter template with authentication, database, and modern UI — designed for both human developers and AI coding agents.

## Why This Template?

This starter is opinionated enough to get you building fast, but not so opinionated that you spend more time ripping things out than building. If you don't like Prisma or Better Auth, this probably isn't the template for you — but if you do, you'll be up and running in 5 minutes.

The real superpower? **AI agent support.** The `AGENTS.md` and `.agents/` directory give coding agents (meant for Codex with `Exec Plans` but Claude, Cursor, Copilot, etc. will be fine) immediate context on how this project works. Point your agent at the codebase and start vibe coding your app.

> 📦 **Part of a series**: This is the auth + database variant. There's a plain verson without Auth or DB. and another with Stripe + Better Auth Organizations variant is coming soon.

## Features

- ⚡ **Nuxt 4** — Latest Nuxt with Vue 3.5
- 🎨 **shadcn-nuxt + Tailwind v4** — Beautiful, accessible UI components
- 🔐 **Better Auth** — Full authentication with email/password, email OTP, and OAuth
- 🗄️ **Prisma** — Type-safe database ORM (configured for Prisma Postgres)
- 📧 **Resend** — Transactional emails for OTP verification
- 🤖 **AI Agent Ready** — AGENTS.md + ExecPlan system for coding agents
- 🧪 **Vitest** — Unit, Nuxt, and E2E testing setup
- 🛠️ **OXC** — Fast linting and formatting with oxlint + oxfmt

### Batteries Included

These modules are pre-configured and ready to use:

| Module            | What it does                                             |
| ----------------- | -------------------------------------------------------- |
| **@nuxt/scripts** | Keeps tracking/analytics scripts from blocking page load |
| **@nuxt/image**   | Optimized images with lazy loading and responsive sizing |
| **@nuxt/hints**   | Performance hints for improving page load times          |
| **@nuxt/fonts**   | Automatic font optimization                              |
| **@vueuse/core**  | Collection of essential Vue composition utilities        |

## Auth Methods

- Email + password (with email verification)
- Email OTP (passwordless sign-in, verification, password reset)
- OAuth: Google + GitHub (enabled when env vars are set)

## Quick Start

```bash
# Clone the template
npx degit daver987/nuxt-shadcn-prisma-auth my-app
cd my-app

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# Set up the database
pnpm prisma migrate dev

# Start development server
pnpm dev
```

**That's it.** You're ready to build.

## Environment Variables

The `.env.example` file includes links to generate your secrets. Here's what you need:

```bash
# Database (Prisma Postgres - 5 free databases on free tier)
# https://www.prisma.io/postgres
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

# Better Auth
# Generate a secret: https://www.better-auth.com/docs/installation#set-environment-variables
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Resend (for email OTP)
# https://resend.com
RESEND_API_KEY="re_..."
RESEND_FROM="noreply@yourdomain.com"

# OAuth (optional - only enable what you need)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## AI Agent Support

This template is designed to work seamlessly with AI coding agents. The agent configuration lives in:

```
AGENTS.md              # Project conventions, auth setup, tooling commands
.agents/
  PLANS.md             # ExecPlan format for complex features
  ref_docs/            # Drop reference docs here for your agent
```

### How it works

1. **AGENTS.md** tells agents how this project is structured — UI conventions, state management patterns, auth configuration, and available commands.

2. **ExecPlans** (`.agents/PLANS.md`) provide a structured format for agents to plan and execute complex features. The agent creates a self-contained plan, then implements it milestone by milestone.

3. **ref_docs/** is a place to drop documentation your agent might need — API specs, design docs, library references, etc.

Point your agent at the repo and tell it to read `AGENTS.md` first. It'll know what to do.

## Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm format           # Format with oxfmt
pnpm format:check     # Check formatting
pnpm lint             # Lint with oxlint
pnpm lint:fix         # Fix lint issues
pnpm type-check       # Type checking
pnpm life             # Run all checks (format + lint + type-check)

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Unit tests only
pnpm test:nuxt        # Nuxt runtime tests
pnpm test:e2e         # E2E tests
pnpm test:watch       # Watch mode

# Database
pnpm prisma migrate dev    # Run migrations
pnpm prisma generate       # Generate client
pnpm prisma studio         # Open Prisma Studio
```

## Project Structure

```
app/
  components/
    ui/                # shadcn components
  composables/         # Vue composables
  lib/                 # Auth client
  middleware/          # Route middleware (auth)
  pages/
    auth/              # Auth pages (sign-in, sign-up, verify, etc.)
    index.vue          # Home with data fetching examples
    dashboard.vue      # Protected page example
server/
  api/
    auth/[...all].ts   # Better Auth handler
  utils/
    auth.ts            # Better Auth config
    db.ts              # Prisma client
prisma/
  schema.prisma        # Database schema
shared/
  utils/               # Shared utilities
  types/               # Shared types
tests/
  unit/                # Unit tests
  nuxt/                # Nuxt runtime tests
  e2e/                 # End-to-end tests
.agents/
  PLANS.md             # ExecPlan instructions
  ref_docs/            # Reference docs for agents
AGENTS.md              # Agent conventions
```

## Pages

| Route                   | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `/`                     | Home page with data fetching examples and session display |
| `/auth/sign-in`         | Sign in with email/password or OAuth                      |
| `/auth/sign-up`         | Create new account                                        |
| `/auth/verify-email`    | Verify email with OTP                                     |
| `/auth/forgot-password` | Request password reset                                    |
| `/auth/reset-password`  | Reset password with OTP                                   |
| `/dashboard`            | Protected page (requires auth)                            |

> 💡 **Tip**: Want to see the index page without logging in? Comment out the `definePageMeta` middleware in `app/pages/index.vue`.

## Conventions

- Shared state uses `useState` with the key defined outside the composable
- Initialize shared state at the page/layout level with `callOnce`
- Prefer shadcn components; avoid wrapper components unless they add real behavior
- Validate once at the edge in server routes; avoid repeated guards
- Protected pages use the `auth` middleware

## Database Setup

This template is configured for [Prisma Postgres](https://www.prisma.io/postgres) — you get 5 free databases on the free tier, no credit card required.

After modifying `prisma/schema.prisma`:

```bash
# Generate migration
pnpm prisma migrate dev --name your-migration-name

# Regenerate client
pnpm prisma generate
```

To add/update Better Auth tables:

```bash
npx @better-auth/cli@latest generate --config ./server/utils/auth.ts
pnpm prisma migrate dev --name better-auth
pnpm prisma generate
```

## Swapping Things Out

This template is intentionally focused. If you need different tools:

- **Don't want Prisma?** Use a different starter.
- **Don't want Resend?** Swap the email provider in `server/utils/auth.ts` — it's just a `sendVerificationOTP` function.
- **Don't want Better Auth?** Use a different starter.
- **Don't want the extra Nuxt modules?** Remove them from `nuxt.config.ts`.

## License

MIT © [David Robertson](https://github.com/daver987)
