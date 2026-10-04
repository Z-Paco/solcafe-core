# AGENTS.md

Guidance for AI agents (and humans) working in this repository. This file is the
source of truth for project direction — read it fully before making changes.

## Project Overview

SolCafe is a small student-built experiment and personal passion project that
brings faith, beauty, and technical work together around energy stewardship in
Alberta. It is a place for informative energy content and the
creative/engineering work that imagines and builds better systems — treating
art and engineering as one integrated sector. Rooted in a Catholic understanding
of creation care and stewardship, it prioritizes a clear point of view over
broad market appeal. Built as a portfolio demonstration of product thinking,
architecture, and iteration while the builder finishes a Software Development
diploma at SAIT.

**Audience:** primarily the builder's portfolio plus a narrow set of people who
share (or are open to) a faith-informed stewardship lens on Alberta energy.
This narrowing is an intentional, owned trade-off — not a problem to solve.

**Agent rules:**

- Prefer the conviction-driven framing above. Do not re-introduce broad
  "community platform seeking market fit" language or features that assume high
  engagement is the goal.
- The Catholic creation-care / stewardship lens is intentional. Do not dilute
  or hide it.
- The live site (https://www.solcafe.ca/) still reflects pre-pivot community
  framing. Do not "fix" site copy toward the old positioning; this file wins.

## Current Priorities

1. **News section** — primary focus; the lowest-friction entry point.
2. Art + engineering content exists but is secondary.
3. Scope is intentionally capped: this is a portfolio + passion project and must
   not crowd out the builder's diploma or parallel technical work.

**Filter for any feature work:** "Does this help ship informative energy
content or soft creation work — or does it re-introduce community cold-start
complexity?"

## Roles System Status

The original role-progression system ("Solaris Engine": Dreamer / Techie /
Book Keeper, etc.) has been deliberately simplified. It is effectively
disabled/presentational. Some progression rows still exist in database tables
but are not in use. Treat role-progression machinery as non-priority and
potentially vestigial. Do not expand it without explicit direction.

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript throughout
- Tailwind CSS 4 alongside custom CSS (BEM-style naming; see README)
- Supabase auth via the modern SSR pattern (`@supabase/ssr`)
- No test suite (Jest deps pruned Oct 2026; lint + typecheck are the checks)

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Run lint + typecheck after changes; they are the fastest correctness check
available here.

## Repository Layout

- `app/` — App Router pages and API routes
  - Content types (each with `create`, `edit`, `[slug]`): `art/`, `news/`,
    `engineer/`
  - Other routes: `about/` (+ `roles`), `dashboard/`, `profile/`
    (`comm/`, `contact/` still on disk but hidden from nav per scope cap)
  - Auth flows: `login/`, `signup/`, `verify/`, `reset-password/`,
    `update-password/`
  - API routes: `api/extract-metadata` only (`api/posts`, `api/profile`
    removed Oct 2026 — pages query Supabase directly; `api/roles`,
    `api/contribute` never existed)
  - `app/styles/` — global CSS, themes, templates
- `components/` — `common/`, `content-editors/`, `roles/`
- `lib/supabase/` — SSR client setup (`server.ts`, `middleware.ts`)
- `lib/types/database.ts` — generated DB types
- `middleware.ts` — root middleware (Supabase session refresh)
- `types/css.d.ts` — CSS module declarations
- Note: no test suite and no Jest config (pruned Oct 2026 along with
  `lib/supabaseClient.ts`, `lib/supabase/client.ts`, `utils/theManager.js`).
  README's old testing section has been replaced with lint + typecheck.

## Known Technical Debt (do not auto-fix)

None currently tracked. Past debt resolved Oct 2026: finished SSR migration
(removed `@supabase/auth-helpers-*`, all client code on `@supabase/ssr`
browser/server/middleware helpers); deleted `utils/theManager.js`,
`lib/supabaseClient.ts`, dead `lib/supabase/client.ts` duplicate (recreated
as canonical browser client during migration).

**Agent behavior:** flag these if they surface during unrelated work and
document cleanup steps. Do not clean them up automatically unless explicitly
asked.

## Hard Guardrails — do NOT touch without explicit authorization

- Environment variables / secrets (`.env*`, Vercel env, Supabase service-role
  keys)
- Production database schema changes or destructive migrations
- Deploy configuration (Vercel project settings, domains)
- Live user data actions — `profile` and `posts` contain real data; be careful
  with anything that reads/writes them beyond what the task requires
- Commits or pushes to connected repositories

Do not make changes to connected repos without authorization.

## Workflow Conventions

- **Commits:** conventional-commit style (`feat:`, `chore:`, `fix:`, ...).
- **Never commit or push without an explicit "yes"** from the human. Always
  propose the commit message and exact changeset first.
- Prefer producing clear, self-contained outlines, PR descriptions, and
  migration notes over large unreviewed code dumps.

## Deployment

- Live site: https://www.solcafe.ca/
- Next.js on Vercel; single shared Supabase project — no staging environment,
  so treat production data accordingly.
