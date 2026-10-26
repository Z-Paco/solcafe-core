---
description: Fast correctness check — lint + typecheck + copy/contrast gates
---
Run the fastest correctness check available here. Stop at the first real failure and report it. Do not fix unless asked.

1. `npm run lint`
2. `npm run typecheck`
3. `npm run copy:check`
4. `npm run contrast:check` — only if the script exists in `package.json`.

There is no test suite (see AGENTS.md); do not run or scaffold one.
