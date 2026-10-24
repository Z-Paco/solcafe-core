import React from "react";
import { copy } from "@/content/copy";

const HEADING = /^h[1-6]$/;

/** "Home headline (the page h1): see …" -> "Home headline" */
function shortLabel(brief) {
  return brief.split(/[:(]/)[0].trim();
}

/**
 * Renders a prose slot from content/copy.ts. While the builder has not written
 * it, shows a ruled "scribe" placeholder: a small inscription naming the slot
 * and its COPY_PROPOSALS section, an optional ghost of the slot's name at the
 * real type size, and `lines` ruled lines.
 *
 * An empty heading never puts the placeholder inside the heading: it renders
 * a visually hidden `fallback` heading (so the page keeps its outline) next to
 * the placeholder note.
 *
 *   <CopySlot id="home.mission" as="h1" size="display" ghost="Your headline" fallback="SolCafe" lines={2} />
 *   <CopySlot id="about.what.body" as="p" paragraphs />
 *
 * @param {{
 *   id: string,
 *   as?: string,
 *   className?: string,
 *   lines?: number,
 *   paragraphs?: boolean,
 *   htmlId?: string,
 *   label?: string,
 *   ghost?: string,
 *   size?: "display" | "heading" | "lede" | "small",
 *   fallback?: string,
 *   [attribute: string]: unknown,
 * }} props
 */
export default function CopySlot({
  id,
  as: Tag = "p",
  className = "",
  lines = 1,
  paragraphs = false,
  htmlId = "",
  label,
  ghost,
  size,
  fallback,
  ...rest
}) {
  const slot = copy[id];
  if (!slot) return null;

  if (slot.text) {
    if (paragraphs) {
      const parts = slot.text.split(/\n\s*\n/).filter(Boolean);
      return (
        <div className={className} id={htmlId || undefined} {...rest}>
          {parts.map((part, i) => (
            <p key={i}>{part}</p>
          ))}
        </div>
      );
    }
    return (
      <Tag className={className} id={htmlId || undefined} {...rest}>
        {slot.text}
      </Tag>
    );
  }

  const isHeading = HEADING.test(Tag);
  const inline = Tag === "span";
  const Box = inline ? "span" : "div";
  const tag = [label ?? shortLabel(slot.brief), slot.proposal].filter(Boolean).join(" · ");
  const classes = ["scribe", size && `scribe--${size}`, inline && "scribe--inline", className]
    .filter(Boolean)
    .join(" ");

  const note = (
    <Box
      className={classes}
      role="note"
      aria-label={`Placeholder: ${slot.brief}`}
      data-copy-slot={id}
      id={!isHeading || !fallback ? htmlId || undefined : undefined}
    >
      <span className="scribe__tag" aria-hidden="true">
        {tag}
      </span>
      {ghost && (
        <span className="scribe__ghost" aria-hidden="true">
          {ghost}
        </span>
      )}
      {Array.from({ length: Math.max(1, lines) }, (_, i) => (
        <span key={i} className="scribe__ln" aria-hidden="true" />
      ))}
    </Box>
  );

  if (isHeading && fallback) {
    return (
      <>
        <Tag className="sr-only" id={htmlId || undefined}>
          {fallback}
        </Tag>
        {note}
      </>
    );
  }
  return note;
}
