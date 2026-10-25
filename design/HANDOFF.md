# Handoff: SolCafe

## Next session checklist (updated 2026-10-25, later)
1. PR #7 (https://github.com/Z-Paco/solcafe-core/pull/7, branch `feat/write-editor-and-contact`) is open, checks pass, not merged. `feat/window-of-light` was merged earlier as #6. Ask the builder about merging.
2. The builder's `public.authors` row exists (`86b8b3e7-579a-4529-98dd-7eb58ed09796`, added 2026-10-25). The signed-in /write test (one throwaway draft per type, deleted after, Claude in Chrome, dev server on :3100 with the main checkout's env) is approved and **not yet run**.
2a. DB cleanup (2026-10-25). DONE: `posts_user_id_idx`; `comments`, `role_progressions` (rows archived in `design/archive/role_progressions.json`) and `posts.likes_count/comments_count/content` dropped (the builder ran the SQL in the dashboard because the auto-mode classifier blocked the drops); trigger `authors_create_profile` (a new author gets an empty profile row, because `posts.user_id` references `profiles` and `lib/posts.ts` embeds `profiles(...)`: do NOT repoint that FK). Public pages smoke-tested 200 afterwards. NOT DONE: replace the profiles/posts RLS policies with `(select auth.uid())` and one merged posts SELECT policy (performance only); `drop extension pg_graphql` (unused); delete 4 unused test users (`test@email.com`, `alerttander@hotmail.gov`, `draco298sander@gmail.ca`, `rohey17422@ofacer.com`); delete the 16 orphaned `post-images` files in the dashboard (SQL would leave the files in storage; keep only `cover-1750631306684.png` and `schematic-1750631283295-wn79aun68yp.png`). Dashboard only: leaked-password protection, Postgres upgrade. Save the final schema to `supabase/migrations/` (none tracked).
2b. The Supabase MCP must be authenticated with write access (role `postgres`). In the earlier session it was `supabase_read_only_user`, which blocked all writes.
3. `/contact` v1 (mailto) is committed as `d25a42c` and the `uniqueSlug` fix as `54901f5` (slug uniqueness spans all types because `posts_slug_key` is global). Neither is pushed. Pass 4 is `33e95f7` and `703c9d7`. AGENTS.md (the `next dev` block) is still left out.
4. Email forwarding is **done and tested** (2026-10-25): ImprovMX forwards `contact@solcafe.ca` to the builder's Gmail; MX and SPF are live on GoDaddy and a test email arrived. Not yet tried: the `/contact` form end to end from a real mail client, Gmail filters by subject tag, and Gmail "Send mail as" (needs the `_spf.google.com` include added to the SPF record).
5. The four form reasons are approved as listed.
6. Unrelated to the repo: the builder has a PC suspend/display fix guide at `~/Desktop/suspend-display-fix.md`. If they bring it up, start from step 2 there (check the logs).

## START HERE: pass 4 (2026-10-24), unified editor and contact
The worktree is `.claude/worktrees/agent-ad3856b84d5a683d6`, on branch `feat/window-of-light` (commits `005f1ff` and `2f97ec6`, not pushed). The work below is **uncommitted**, waiting on the builder's "yes".

### Done (uncommitted)
1. **Input-border contrast.** In `app/styles/globals.css`, `--color-border-strong` is `#859080` in Day (3.10:1) and `#566b61` in Vespers (3.25:1). The new gate `npm run contrast:check` (`scripts/check-contrast.mjs`) checks 19 token pairs in both themes and exits non-zero on failure.
2. **One editor at `/write`** (plan: `~/.claude/plans/sure-do-the-token-sleepy-yao.md`):
   - Routes: `app/write/page.jsx` (create, `?type=news|art|engineer`, News by default) and `app/write/[type]/[slug]/page.jsx` (edit; the type is fixed).
   - `components/content-editors/PostEditor.jsx` holds the shared form: title, description, cover uploader, tags, published. The type tabs swap in the existing `News`, `Art` and `Engineering` content editors. Only the active tab's metadata is saved, and edit has delete.
   - Gate: create requires a `public.authors` row, and edit requires being the post's owner. Anyone else sees "Not available".
   - `lib/editor.ts` holds the limits, `createSlug`, `uniqueSlug` (per type), `uploadPostImage`, `fallbackCover`, `contentProblem` and `storagePaths`.
   - Removed: the six old `create` and `edit` pages, and the unused base64 cover input in `NewsContentEditor`. Old URLs return a 308 redirect (`next.config.js`). Links, `robots.ts` (`/write`) and the `AuthorActions` doc comment are updated.
   - Behaviour changes: slugs no longer change when a title is edited, and a new draft opens in the editor after saving.
   - Checks: lint shows 0 errors, typecheck is clean, the build passes, and curl confirms the redirects and that `/write` returns 200.
   - **Not verified:** signed-in create, edit and delete against Supabase. They write to production `posts`, so ask first. Also not verified: tabs at 390px, and Vespers screenshots.
3. `UX_NOTES.md` has a "Unified editor" section, including the dead preview CSS in `postEditor.css` (flagged as debt, not deleted).

### Proposed commits (ask before running)
- `fix: raise input border contrast` covers `globals.css`, `scripts/check-contrast.mjs` and `package.json`.
- `refactor: unify post editors under /write` covers everything else above.
- `AGENTS.md` stays out. Its only change is the block `next dev` adds automatically.

### Decided: publishing flow
Writing is by invitation only: a builder-vetted `public.authors` row, enforced by RLS. Sign-up stays off. A new **`/contact`** page is the single front door for everything: general questions, people asking to become a publisher, corrections, and collaboration.

### Next: the `/contact` page (not started)
- **Address:** `contact@solcafe.ca`. A new Gmail account wasn't possible (phone verification limit), so it forwards to the builder's existing Gmail.
- **Builder's task (email setup):** the DNS is on **GoDaddy** (`domaincontrol.com`). It has no MX records yet, and `www` is a CNAME to Vercel, which must stay untouched.
  1. Sign up for ImprovMX (free) and add the alias `contact` → the builder's Gmail.
  2. In GoDaddy, add: MX `@` `mx1.improvmx.com` (10), MX `@` `mx2.improvmx.com` (20), and one TXT `@` `v=spf1 include:spf.improvmx.com include:_spf.google.com ~all`. Confirm these against ImprovMX's dashboard.
  3. Send a test email. Add a Gmail filter and label. Optionally set up Gmail "Send mail as" `contact@solcafe.ca` (`smtp.gmail.com:587` with an app password, which needs 2-step verification).
- **Build (agent, once the builder says go):**
  - A form with a reason selector. The proposed options, awaiting the builder's OK: General question, Become a publisher, Correction or source issue, Collaboration. They map to the subject tags `[General]`, `[Publishing]`, `[Correction]` and `[Collaboration]`.
  - v1 builds a `mailto:` with the subject and body pre-filled, so it needs no backend.
  - v2 later sends through **Resend**: a server action, Reply-To set to the visitor, a honeypot field and a rate limit. Its DNS is on the `send.solcafe.ca` subdomain, and its API key goes in Vercel env, which **the builder adds** (env is a guardrail).
  - The page layout stays the same between versions. Keep the address in one config spot.
  - All prose (intro, what vetting means, any wording about the faith lens) goes in `content/copy.ts` as placeholders. The builder writes it, and nothing faith-related is changed without the builder's OK.
  - Add a footer link to `/contact`.

---

# Pass 3, Window of Light (history)

- **Plan:** `/home/sandpac/.claude/plans/fetch-latest-tender-rabin.md` (approved).
- **Worktree:** `.claude/worktrees/agent-ad3856b84d5a683d6`, all uncommitted.
- **Reference:** `design/window-of-light.html` and `design/README.md`, plus the Artifact at https://claude.ai/artifact/UUPEkyd3u4ueocUcfcTvNp (v2).

## Done
- Step 0 (save): the mock and README are in the worktree, and the memory notes are updated.
- `lib/glass/core.ts`, `lib/glass/panels.ts`, `lib/glass/window.ts`.
- `components/glass/` files: `Shapes.jsx` (including Turbines), `RoseWindow.jsx`, `GlassDefs.jsx`, `GlassPanel.jsx`, `HeroWindow.jsx`, `ArchWindow.jsx`.
- None of these have been linted, typechecked or wired in yet.

## Update 2026-10-24
Steps 1–8 are done:
- the glass components;
- `globals.css`;
- `layout.tsx`;
- the CopySlot "scribe" rewrite;
- the header, footer and ThemeToggle;
- home (the nave, chronicle, lancets and canticle);
- About (the folio).

Lint shows 0 errors, typecheck is clean, and the checkpoint screenshots pass: 0 overflow, one `<h1>`, no slots inside headings, and no console errors at 1280px and 390px in Day and Vespers. Waiting on the builder's approval. After that comes step 9: news, art and engineer, then 404 and error, then the author pages, then cleanup (retire `sky.css`, `SkyClock`, `lib/sky.ts`, `HorizonArt`, `SunMark`, `Cover` and `PageIntro` once nothing imports them).

## Update 2026-10-24 (later)
The builder approved the checkpoint and the first commit was made: `005f1ff` on `feat/window-of-light`. The rollout is done in the working tree and **not yet committed**, pending the builder's yes:
- News index (chronicle) and news detail (folio leaf, margin notes, seeded glass band when there is no cover).
- Art and engineering indexes (lancet galleries; a single work shows as an exhibit) and their details (artwork framed whole in lead and gold; engineering cover pane or wind-glass band).
- 404 and error pages (a dark nave with one lancet).
- Author pages pick up the new tokens.
- Retired: `SkyClock`, `HorizonArt`, `SunMark`, `Cover`, `lib/sky.ts`, and the `sky`, `art`, `engineer` and `news` stylesheets.

Checks:
- Lint shows 0 errors, typecheck is clean, and the build passes.
- Every public route passes at 1280px and 390px in Day and Vespers: 0 overflow, one `<h1>`, no slots inside headings, and no console errors (the only error logged is the 404 page's own 404 response).
- Every text token pair passes WCAG AA; the lowest is gold-ink on the Day wall at 4.69:1.

## Next, in order (original list)
1. `components/glass/LightBeams.jsx`. Its write was interrupted, so the file does not exist yet. Port the `beams()` function from `design/window-of-light.html`:
   - seven shafts;
   - on wide screens they slant down-left from the window; on narrow screens they fall straight down;
   - `useSyncExternalStore` on `(min-width: 961px)`.
2. `components/glass/Motes.jsx`: a canvas that pauses via IntersectionObserver and stays static under reduced motion.
3. `components/glass/Arcade.jsx` and `Vine.jsx`, using SVG patterns so no JS is needed.
4. Rewrite `app/styles/globals.css`:
   - Keep the semantic `--color-*` names and remap their values to the mock palette.
   - Add the glass and architecture tokens.
   - Keep compatibility aliases for `--canola-400`, `--gradient-chinook`, `--sky-gradient` and `--sky-band`.
   - Fonts: `--ff-display` and `--ff-accent` become Cormorant, add `--ff-inscr` for Cinzel, and `--ff-body` becomes EB Garamond.
   - Restyle the btn, tag, eyebrow, meta and empty-state primitives, and add the arch mask CSS variable.
5. `app/layout.tsx`: switch to the variable versions of Cormorant Garamond, Cinzel and EB Garamond, add `<GlassDefs/>`, remove SkyClock, getSkyPhase and `sky.css`, and set the theme colours to `#edf1ea` and `#0c1613`.
6. Rewrite `CopySlot` into the "scribe" style with `label`, `ghost`, `size` and `fallback` props. An empty heading slot renders an sr-only fallback plus a `role="note"` scribe, never a placeholder inside an `<h1>`.
7. Header, Footer and ThemeToggle (Day/Vespers labels), then Home, then About as a folio.
8. **Checkpoint:** screenshot home and about against the mock and show them to the builder.
9. After the builder approves: news, art and engineer pages, then 404 and error, then token swaps on the author pages, then cleanup.

## Open items for the builder
- Insert your row into `public.authors`; it had 0 rows when last checked.
- Wordmark spelling: "SolCafe" in the code versus "Solcafe" in the mock.
- The commit decision, including the AGENTS.md block that `next dev` added automatically.

To resume, start the main chat with: "Resume pass 3 from the handoff at step 1."
