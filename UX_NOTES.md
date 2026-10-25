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

## Unified editor (/write)
- One editor replaces the six create/edit pages: `/write?type=news|art|engineer` and `/write/<type>/<slug>`. Old URLs 308-redirect (next.config.js). Tabs only on create; an edited post keeps its type.
- Shared logic in `lib/editor.ts`; the three type editors are unchanged except News lost its unused base64 cover field. Slugs are now unique per type and stay fixed on edit (news used to re-slug when the title changed).
- Known debt, not fixed: `postEditor.css` still has preview-mode and `.related-link*` rules that nothing renders.
- Not verified: signed-in create/edit/delete against Supabase (writes to production posts; needs the builder's go-ahead), tabs at 390px, Vespers screenshots.

## Contact (/contact), v1 mailto
- The single front door. `lib/contact.ts` is the one place for the address (`contact@solcafe.ca`), the four reasons and their subject tags (`[General]`, `[Publishing]`, `[Correction]`, `[Collaboration]`), and `mailtoHref`.
- v1 opens the visitor's mail app with subject and body filled in (CRLF line breaks per RFC 6068). The message is capped at 1500 characters because long mailto links fail in some clients. Email is required now so the layout and fields match v2.
- `?reason=publishing` (or any reason id) preselects a reason. The /write "Not available" state links there.
- All prose is slots (`contact.*` in `content/copy.ts`): title, lede, the publisher-vetting note and the meta description. UI labels stay in the component.
- v2 (later): a Resend server action with the same fields, Reply-To set to the visitor, a honeypot field and a rate limit. The API key goes in Vercel env, which the builder adds.
- Checked: 1280px and 390px in Day and Vespers (0 overflow, one h1, no console errors), validation and focus, the preselect, and the generated mailto. Not checked: a real mail client opening the link.
