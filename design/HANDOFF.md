# Handoff: SolCafe pass 3, Window of Light

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
