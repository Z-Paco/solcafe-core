// All site prose lives here. The builder writes it; agents only add slots.
//
// A slot is { text, brief, proposal? }.
//   text:     the final words, or null while unwritten
//   brief:    one line telling the builder what belongs here
//   proposal: the COPY_PROPOSALS.md section that has options and sources
//
// A null slot renders a dashed placeholder (components/common/CopySlot.jsx)
// that shows the brief, so the layout is visible before the words exist.
// Metadata (title/description/OG) reads from here too and falls back to
// "SolCafe" or nothing when a slot is null. Run `npm run copy:check` for the
// list of empty slots.
//
// UI microcopy (nav labels, button labels, "Sources", "Build steps", error
// labels) is interface, not prose, and stays in the components.

export type CopyKey = keyof typeof copy;
export type Slot = { text: string | null; brief: string; proposal?: string };

const slot = (text: string | null, brief: string, proposal?: string): Slot => ({
  text,
  brief,
  ...(proposal ? { proposal } : {}),
});

export const copy = {
  // ---------- Site-wide ----------
  // yours, from HEAD (app/layout.tsx description)
  "site.description": slot(
    "Energy stewardship in Alberta — news, art, and engineering through a creation-care lens.",
    "Site description for search results and link previews."
  ),
  "header.tagline": slot(
    null,
    "Header tagline under the wordmark, short (hidden on narrow screens): see COPY_PROPOSALS §1",
    "§1"
  ),
  "footer.line": slot(
    null,
    "Footer line beside the wordmark: see COPY_PROPOSALS §4",
    "§4"
  ),

  // ---------- Home ----------
  "home.mission": slot(
    null,
    "Home headline (the page h1): see COPY_PROPOSALS §2",
    "§2"
  ),
  "home.lede": slot(
    null,
    "One or two sentences under the home headline: see COPY_PROPOSALS §2",
    "§2"
  ),
  "home.lens.heading": slot(
    null,
    "Heading of the lens band at the bottom of home: see COPY_PROPOSALS §3",
    "§3"
  ),
  "home.lens.body": slot(
    null,
    "Body of the lens band at the bottom of home: see COPY_PROPOSALS §3",
    "§3"
  ),
  "home.lens.epigraph": slot(
    null,
    "Optional epigraph for the lens band (quote + source): see COPY_PROPOSALS §3",
    "§3"
  ),
  "home.lens.epigraphSource": slot(
    null,
    "Source line for the lens epigraph, e.g. document and section number",
    "§3"
  ),

  // ---------- News ----------
  // yours, from HEAD (app/news/page.jsx)
  "news.title": slot("Energy news for Alberta", "News index headline."),
  // yours, from HEAD (app/news/page.jsx)
  "news.lede": slot(
    "Sourced updates on energy stewardship, tracked through a creation-care lens",
    "One line under the news headline."
  ),
  "news.metaDescription": slot(
    null,
    "News index description for search results and link previews."
  ),
  "news.empty": slot(
    null,
    "Empty state when there are no news posts yet: see COPY_PROPOSALS §6",
    "§6"
  ),

  // ---------- Art ----------
  "art.lede": slot(
    null,
    "One line under the Art gallery headline: see COPY_PROPOSALS §7",
    "§7"
  ),
  "art.metaDescription": slot(
    null,
    "Art index description for search results and link previews."
  ),
  "art.empty": slot(
    null,
    "Empty state when there is no artwork yet: see COPY_PROPOSALS §6",
    "§6"
  ),

  // ---------- Engineering ----------
  "engineer.lede": slot(
    null,
    "One line under the Engineering headline: see COPY_PROPOSALS §7",
    "§7"
  ),
  "engineer.metaDescription": slot(
    null,
    "Engineering index description for search results and link previews."
  ),
  "engineer.empty": slot(
    null,
    "Empty state when there are no engineering posts yet: see COPY_PROPOSALS §6",
    "§6"
  ),

  // ---------- About ----------
  // yours, from HEAD (app/about/page.jsx), em dash and wording kept exactly
  "about.title": slot("About Solcafe", "About page headline."),
  "about.what.heading": slot("What this is", "First About section heading."),
  "about.what.body": slot(
    "Solcafe is a student-built portfolio project around energy stewardship in Alberta, rooted in a Catholic understanding of creation care. It treats art and engineering as one integrated practice — a place for informative energy content and the creative work that imagines better systems.",
    "First About section paragraph."
  ),
  "about.find.heading": slot("What you'll find", "Second About section heading."),
  "about.find.body": slot(
    "News is the entry point: short, sourced energy updates. Art and engineering posts are secondary — experiments and visual thinking alongside the reporting.",
    "Second About section paragraph."
  ),
  "about.status.heading": slot("Status", "Third About section heading."),
  "about.status.body": slot(
    "Built while finishing a Software Development diploma at SAIT, so scope is intentionally capped. Roles (Dreamer, Techie, Book Keeper) are presentational only — they don't gate access or content.",
    "Third About section paragraph."
  ),
  "about.metaDescription": slot(
    null,
    "About page description for search results and link previews."
  ),
  "about.creationCare.heading": slot(
    null,
    "Heading for the creation-care section on About: see COPY_PROPOSALS §5",
    "§5"
  ),
  "about.creationCare.body": slot(
    null,
    "Creation-care explanation with cited sources on About: see COPY_PROPOSALS §5",
    "§5"
  ),

  // ---------- Contact ----------
  "contact.title": slot(null, "Contact page headline."),
  "contact.lede": slot(
    null,
    "One or two sentences under the Contact headline: who this inbox is for (questions, publisher requests, corrections, collaboration)."
  ),
  "contact.publishing.heading": slot(
    null,
    "Heading of the note beside the form on becoming a publisher."
  ),
  "contact.publishing.body": slot(
    null,
    "What vetting means: publishing is by invitation, what you look for in an author, and how long a reply may take. Any faith-lens wording is yours."
  ),
  "contact.metaDescription": slot(
    null,
    "Contact page description for search results and link previews."
  ),

  // ---------- Error pages ----------
  "notFound.heading": slot(
    null,
    "404 headline: see COPY_PROPOSALS §8",
    "§8"
  ),
  "notFound.body": slot(
    null,
    "404 explanation, one or two sentences: see COPY_PROPOSALS §8",
    "§8"
  ),
  "error.heading": slot(
    null,
    "Error page headline (something failed to load): see COPY_PROPOSALS §8",
    "§8"
  ),
  "error.body": slot(
    null,
    "Error page explanation: see COPY_PROPOSALS §8",
    "§8"
  ),
} satisfies Record<string, Slot>;

/** Text of a slot, or undefined while it is unwritten. For metadata. */
export function copyText(key: CopyKey): string | undefined {
  return copy[key].text ?? undefined;
}
