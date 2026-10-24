# UX notes, pass 2 (builder agent)

## Renaissance details chosen, and why (restraint)
- Drop cap (Cormorant) on news article bodies and a fleuron end-mark: the two most recognisable details, used once per article.
- Letter-spaced uppercase Cormorant labels for eyebrows and section titles. Cormorant Garamond has no small-cap family on Google Fonts, so these are uppercase with tracking, not true small caps.
- Ruled title frame: a sky hairline above and a double rule below article headers and index headers.
- Desktop (>=1100px) news: quotes and sources sit in a sticky right margin; on narrower screens the same markup folds under the body as numbered notes. These are margin notes, not per-paragraph sidenotes: posts store quotes/sources without anchors to paragraphs.
- Cormorant italic for ledes, deks, pull quotes and epigraphs. Not used: ornamental borders, illuminated capitals elsewhere, small-cap running heads.

## Sky
- lib/sky.ts: phase from approximate Edmonton sunrise/sunset (dawn = -50/+40 min around sunrise, dusk = -60/+50 around sunset). Server sets `<html data-sky>`; SkyClock re-checks every 5 min; CSS @property cross-fade; static under reduced motion.
- Static prerendered pages (about, auth) freeze the build-time phase until SkyClock runs on the client.
- `?sky=dawn|day|dusk|night` works only when NODE_ENV !== production (so `next dev`, not `npm start`); it is kept in sessionStorage.
- Sky contrast: every --sky-top/mid/low stop passes 4.5:1 for heading, text, muted and accent colours in both themes (checked with a throwaway script over app/styles/sky.css; dusk-top light was lightened to pass).

## Reveal note for screenshots
Scroll fade-ins hide offscreen elements until scrolled to. Full-page screenshots should emulate prefers-reduced-motion (everything visible) or scroll first.

## Done / known gaps
- View Transitions: only `@view-transition { navigation: auto }` and a named header; Next client-side Link navigations do not use cross-document transitions, so per-card list-to-detail transitions are NOT built.
- Pre-existing non-site-copy strings left alone: login ("Sign in to continue your solarpunk journey"), signup/verify "solarpunk" wording, dashboard and profile placeholder lines. They predate pass 2 and are auth/author-only, but they are prose; decide whether they become slots.
- Edit pages: the redirect-on-no-user path now keeps the loading view up (no empty-editor flash); art/engineer already had a null-safe user check at this point.
- Deleted: postcss.config.mjs, app/styles/themes/seasonal.css, app/styles/themes/roles.css, components/SupabaseProvider.tsx (sandbox allowed it).
- Not verified: dark-mode screenshots, 361-960px header wrap check, keyboard test of the mobile menu, themeColor meta update in a real browser, signed-in views, author actions.
