---
description: Review changes against SolCafe positioning and guardrails
---
Review the uncommitted changes. Start with `git status --short` and `git diff --stat`, then read the changed files yourself.

1. Positioning: does any copy or feature re-introduce "community platform seeking market fit" language or high-engagement assumptions? Does it dilute the Catholic creation-care lens? AGENTS.md wins over the live site.
2. Scope filter: "Does this help ship informative energy content — or re-introduce community cold-start complexity?" The news section is the priority.
3. Roles system: any expansion of role-progression machinery is out of scope unless explicitly directed.
4. Tech debt: flag any return of `@supabase/auth-helpers-*` (everything is on `@supabase/ssr`) or new plain-JS files; document, don't fix.
5. Guardrails: flag anything touching `.env*`, migrations, Vercel config, or live `profiles`/`posts` data beyond what the task requires.

Report findings as a list. Do not edit code.
