# Window of Light: approved design reference

`window-of-light.html` is the approved static mock of the home and About pages. It was approved by the builder on 2026-10-23. Open it in a browser; the bar at the top switches between the pages and between the Day and Vespers themes. It is also published as a private Artifact: https://claude.ai/artifact/UUPEkyd3u4ueocUcfcTvNp (v2, "Window of light, iteration 4").

When building the real pages, compare them against this file side by side at 1280px and 390px, in both themes.

## Concept
A nave of light.
- **Home:** a stained-glass prairie dawn (nature) under a rose window (spirit), with technology small on the horizon. Its coloured light falls across the stone wall onto the words.
- **Art and engineering:** twin lancet windows under one round oculus.
- **About:** a manuscript folio, with green rubrics in the margin, gold drop caps and a vine.

## Tokens
- **Glass:** the original SolCafe hues: `#79c9f4` sky, `#4fa6d8` deep sky, `#a9d86e` lime, `#bfe94e` pear, `#7ca353` forest, `#fdfb75` sun, `#f3d34a` deep sun. Lead lines are `#1b2822`.
- **Day:**
  - page `#f5f7f5`, wall `#edf1ea`, ink `#1f2a22`;
  - gold-ink `#8a6414`, leaf-ink `#3b6618`, sky-ink `#1d5e86`.
- **Vespers (dark):**
  - page `#0b1512`, wall `#0c1613`, ink `#eaf0e5`;
  - gold-ink `#e2c068`, leaf-ink `#c3e590`, sky-ink `#9fd6f7`.
- **Contrast:** the fixes apply to text only. Glass and surfaces keep the original hues.

## Type
- **Cormorant Garamond:** display and headings.
- **Cinzel:** inscription capitals, for short labels only, at 0.74rem or larger.
- **EB Garamond:** body text, about 1.16rem, with a 62-character measure.

## Generators (in the mock's script)
These are deterministic and seeded (mulberry32):
- `rose()`: the rose window.
- `sunburst()`: glass whose lead lines follow the sun's rays.
- `bands()`: fields and wind streamlines, cut by hand-style diagonals.
- `buildWindow()`: the hero prairie dawn.
- The pointed-arch mask.

## Motion
The window kindles on load, the light shafts fade in, gold motes drift on a canvas, the large rose turns over about 5 minutes, and the turbines turn. Everything is visible at rest and static under `prefers-reduced-motion`.

## Copy
The builder writes all prose. Each slot is a ruled "scribe" line with an inscription tag and a faint ghost name at the real type size, and points to its section of `COPY_PROPOSALS.md`.
