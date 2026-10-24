# SolCafe copy proposals (ideas for the builder)

The site ships with **no agent-written prose**. Every spot that needs words is
a slot in `content/copy.ts`, and an unwritten slot shows a dashed box with a
one-line brief. Run `npm run copy:check` for the list of empty slots. You write
the text; this file only holds ideas and the sources behind them.

Slots marked "yours, from HEAD" in `content/copy.ts` are your original wording,
restored exactly (About page, news headline and lede, site description).

Passages below were retrieved through the Magisterium MCP on 2026-10-23 and are
reproduced as returned. Check them against vatican.va before publishing. The
option text outside quotation marks is a proposal, not a statement of teaching,
and nothing here is on the site.

## Slot index

| Section | Slot IDs in `content/copy.ts` | Where it shows |
|---|---|---|
| §1 | `header.tagline` | Under the wordmark in the header |
| §2 | `home.mission`, `home.lede` | Home hero (the page h1 and the line below) |
| §3 | `home.lens.heading`, `home.lens.body`, `home.lens.epigraph`, `home.lens.epigraphSource` | Lens band at the bottom of home |
| §4 | `footer.line` | Footer |
| §5 | `about.creationCare.heading`, `about.creationCare.body` | About page, creation-care section |
| §6 | `news.empty`, `art.empty`, `engineer.empty` | Empty states when a section has no posts |
| §7 | `art.lede`, `engineer.lede` | One line under the Art and Engineering headlines |
| §8 | `notFound.heading`, `notFound.body`, `error.heading`, `error.body` | 404 and error pages |
| meta | `news.metaDescription`, `art.metaDescription`, `engineer.metaDescription`, `about.metaDescription` | Search and link-preview descriptions (fall back to nothing while empty) |

---

## Source passages used

| Key | Passage | Source |
|---|---|---|
| LS 12 | "Rather than a problem to be solved, the world is a joyful mystery to be contemplated with gladness and praise." | Pope Francis, *Laudato Si'* §12. https://www.magisterium.com/docs/9bd648d0-8024-4283-ba42-69bc601f9ba0/ref/12 |
| LS 67a | "We are not God. The earth was here before us and it has been given to us." | *Laudato Si'* §67. https://www.magisterium.com/docs/9bd648d0-8024-4283-ba42-69bc601f9ba0/ref/67 |
| LS 67b | "'Tilling' refers to cultivating, ploughing or working, while 'keeping' means caring, protecting, overseeing and preserving. This implies a relationship of mutual responsibility between human beings and nature." | *Laudato Si'* §67 (same URL) |
| LS 67c | "Each community can take from the bounty of the earth whatever it needs for subsistence, but it also has the duty to protect the earth and to ensure its fruitfulness for coming generations." | *Laudato Si'* §67 (same URL) |
| LS 84 | "Soil, water, mountains: everything is, as it were, a caress of God." | *Laudato Si'* §84. https://www.magisterium.com/docs/9bd648d0-8024-4283-ba42-69bc601f9ba0/ref/84 |
| LS 102 | "How could we not acknowledge the work of many scientists and engineers who have provided alternatives to make development sustainable?" | *Laudato Si'* §102. https://www.magisterium.com/docs/9bd648d0-8024-4283-ba42-69bc601f9ba0/ref/102 |
| LS 138 | "It cannot be emphasized enough how everything is interconnected." / "the fragmentation of knowledge and the isolation of bits of information can actually become a form of ignorance, unless they are integrated into a broader vision of reality." | *Laudato Si'* §138. https://www.magisterium.com/docs/9bd648d0-8024-4283-ba42-69bc601f9ba0/ref/138 |
| LS 160 | "What kind of world do we want to leave to those who come after us, to children who are now growing up?" / "Leaving an inhabitable planet to future generations is, first and foremost, up to us." | *Laudato Si'* §160 (via MCP `chat`). https://www.magisterium.com/docs/9bd648d0-8024-4283-ba42-69bc601f9ba0/ref/160 |
| LS 165 | "Until greater progress is made in developing widely accessible sources of renewable energy, it is legitimate to choose the less harmful alternative or to find short-term solutions." | *Laudato Si'* §165. https://www.magisterium.com/docs/9bd648d0-8024-4283-ba42-69bc601f9ba0/ref/165 |
| C&S 57 | "Since man's place as ruler is in fact a participation in the divine governance of creation, we speak of it here as a form of stewardship." | International Theological Commission, *Communion and Stewardship* §57. https://www.magisterium.com/docs/67b1d762-1684-452d-a15e-a9d2ed3e7184/ref/57 |
| C&S 76 | "In the Christian perspective, our ethical responsibility for the natural environment – our 'housed existence' – is thus rooted in a profound theological understanding of visible creation and our place within it." | *Communion and Stewardship* §76. https://www.magisterium.com/docs/67b1d762-1684-452d-a15e-a9d2ed3e7184/ref/76 |
| CSDC 467 | "Responsibility for the environment, the common heritage of mankind, extends not only to present needs but also to those of the future." | Pontifical Council for Justice and Peace, *Compendium of the Social Doctrine of the Church* §467. https://www.magisterium.com/docs/21d06633-8734-43cd-b8bc-9ab3b84ebc30/ref/467 |
| CSDC 481 | "the goods of the earth were created by God to be used wisely by all." | *Compendium* §481. https://www.magisterium.com/docs/21d06633-8734-43cd-b8bc-9ab3b84ebc30/ref/481 |

---

## 1. Header tagline

Slot: `header.tagline`. It needs to be short, since it sits under the wordmark
and is hidden on narrow screens.

- **A.** "Tilling and keeping Alberta's energy". Grounding: LS 67b, the
  "till and keep" reading of Gen 2:15.
- **B.** "Energy stewardship for coming generations". Grounding: LS 67c and
  CSDC 467.
- **C.** A plain, neutral line that names the place and topic only. The lens
  lives on the home and About pages.

## 2. Home mission line (the page's `<h1>`)

Slots: `home.mission` (the h1) and `home.lede` (the line below it).

- **A.** "Alberta energy, read as a gift to keep." Grounding: LS 67a ("it has
  been given to us") and LS 67b ("keeping").
- **B.** "News, art, and engineering for the world we leave behind." Grounding:
  LS 160.
- **C.** "Energy news, art, and engineering, seen whole." Grounding: LS 138
  ("everything is interconnected"). This one names no faith claim in the
  headline and leaves the lens to the section below.

## 3. Home lens section, with an optional epigraph

Slots: `home.lens.heading`, `home.lens.body`, `home.lens.epigraph` and
`home.lens.epigraphSource`.

- **A. Heading:** "Till and keep"
  **Body:** "SolCafe reads Alberta energy through a Catholic understanding of
  creation care: the land and what lies under it are given, not owned outright,
  and the work of using them carries a duty to keep them fruitful for the
  people who come next."
  **Epigraph (LS 67b):** "'Tilling' refers to cultivating, ploughing or working,
  while 'keeping' means caring, protecting, overseeing and preserving." Source:
  *Laudato Si'* §67.
- **B. Heading:** "Everything is connected"
  **Body:** "Energy news, artwork, and engineering notes sit side by side here
  on purpose. A Catholic understanding of creation care treats them as one
  question about how we live on this land."
  **Epigraph (LS 138):** "It cannot be emphasized enough how everything is
  interconnected." Source: *Laudato Si'* §138.
- **C. Heading:** "For those who come after us"
  **Body:** "SolCafe follows Alberta's energy transition with one question in
  view: what kind of province, and planet, gets handed on."
  **Epigraph (LS 160):** "What kind of world do we want to leave to those who
  come after us, to children who are now growing up?" Source: *Laudato Si'*
  §160.

Put the quoted text in `home.lens.epigraph` and the source in
`home.lens.epigraphSource`.

## 4. Footer line

Slot: `footer.line`.

- **A.** "A student-built project on energy stewardship in Alberta, rooted in
  Catholic creation care." This adds your existing About phrase.
- **B.** "Student-built in Alberta. 'The earth was here before us and it has been
  given to us.' (Laudato Si' §67)" Grounding: LS 67a.
- **C.** A plain one-line description of the project, no faith claim.

## 5. About: "Why creation care"

Slots: `about.creationCare.heading` and `about.creationCare.body`.

- **A. Stewardship (Communion and Stewardship + Laudato Si').**
  "In Catholic teaching, human beings are stewards, not owners, of creation.
  The International Theological Commission describes our role as 'a
  participation in the divine governance of creation' and calls it 'a form of
  stewardship' (*Communion and Stewardship* §57). Pope Francis reads the
  Genesis charge to 'till and keep' the garden as 'a relationship of mutual
  responsibility between human beings and nature' (*Laudato Si'* §67). Alberta's
  energy is a large part of how this province tills. SolCafe asks what keeping
  looks like too."
- **B. Energy transition (Laudato Si' §165 + §102).**
  "Laudato Si' addresses energy directly: 'until greater progress is
  made in developing widely accessible sources of renewable energy, it is
  legitimate to choose the less harmful alternative or to find short-term
  solutions' (§165). It also thanks 'the work of many scientists and engineers
  who have provided alternatives to make development sustainable' (§102). That
  balance shapes SolCafe: honest reporting on a province built on oil and gas,
  plus the engineering and art that imagine what comes next."
  *Note: the earlier draft of this option also quoted a phrase about fossil
  fuels being replaced "without delay". It was not in the retrieved passage
  table, so it has been dropped. Re-verify before reusing it.*
- **C. Future generations (Compendium + Laudato Si' §160).**
  "The Church teaches that 'responsibility for the environment, the common
  heritage of mankind, extends not only to present needs but also to those of
  the future' (*Compendium of the Social Doctrine of the Church* §467). Pope
  Francis puts it plainly: 'Leaving an inhabitable planet to future generations
  is, first and foremost, up to us' (*Laudato Si'* §160). SolCafe is a small
  student project working out what that means for energy in Alberta."

---

## 6. Empty states

Slots: `news.empty`, `art.empty`, `engineer.empty`. Shown beside a sky
illustration when a section has no published posts. Brief: say what will
appear here and that it is coming, in your voice. No options proposed.

## 7. Index ledes for Art and Engineering

Slots: `art.lede`, `engineer.lede`. One line under each section headline
(the news lede is already yours, from HEAD). No options proposed.

## 8. 404 and error pages

Slots: `notFound.heading`, `notFound.body`, `error.heading`, `error.body`.
Brief: a short, kind headline and one or two sentences, plus the page's own
"Back to home" / "Try again" buttons, which are interface labels. No options
proposed.

---

## Follow-ups (not in this build)

- **Per-post epigraph:** `/news/[slug]` already renders
  `metadata.epigraph = { text, source, url }` when it is present. The news
  editor does not have fields for it yet.
