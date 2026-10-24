// Shared, server-safe helpers for rendering posts.
// Dates use a fixed locale and time zone so server output never depends on
// the host machine's settings.

const DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "America/Edmonton",
});

const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "America/Edmonton",
});

export function formatDate(value: string | null | undefined, short = false) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return (short ? SHORT_DATE_FORMAT : DATE_FORMAT).format(date);
}

/** yyyy-mm-dd for the <time dateTime> attribute */
export function isoDate(value: string | null | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

/** Split plain text into paragraphs on blank lines. Rendered as text, never HTML. */
export function toParagraphs(text: unknown): string[] {
  if (typeof text !== "string") return [];
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Rough reading time at ~220 words per minute; at least 1 minute. */
export function readingMinutes(...texts: unknown[]) {
  const words = texts
    .filter((t): t is string => typeof t === "string")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** "www.example.com/path" -> "example.com"; falls back to the raw string. */
export function sourceDomain(url: unknown) {
  if (typeof url !== "string" || !url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Only allow http(s) links from post metadata. */
export function safeHref(url: unknown) {
  if (typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

/** Image src from post data: site-relative paths or http(s) URLs only. */
export function safeImageSrc(src: unknown) {
  if (typeof src !== "string" || !src) return null;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  return safeHref(src);
}

export function isLocalImage(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

/** Normalise tags that may arrive as an array or a comma-separated string. */
export function toTags(tags: unknown): string[] {
  const list = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(",")
      : [];
  return [...new Set(list.map((t) => String(t).trim()).filter(Boolean))];
}

/** Metadata is stored as JSON; treat anything that is not an object as empty. */
export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function asArray<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/** Byline: profiles are owner-only under RLS, so the public sees "SolCafe". */
export function bylineName(profile: unknown) {
  const p = asRecord(profile);
  const name = p.display_name || p.username;
  return typeof name === "string" && name.trim() ? name.trim() : "SolCafe";
}

export function excerpt(text: unknown, max = 180) {
  if (typeof text !== "string") return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** URL segment and display label for each content type. */
export const SECTION_PATH = {
  news: "news",
  art: "art",
  engineering: "engineer",
} as const;

export const SECTION_LABEL = {
  news: "News",
  art: "Art",
  engineering: "Engineering",
} as const;
