import React from "react";
import Link from "next/link";
import ArchWindow from "../glass/ArchWindow";
import EmptyState from "./EmptyState";
import { SECTION_LABEL, SECTION_PATH, toTags } from "@/lib/content";

/**
 * One lancet: a post's arched window with its kind, title and description.
 * Art and engineering stand side by side as twin lancets; the index pages
 * set many in a row. `detail` is an extra inscription (medium, difficulty).
 */
export default function Lancet({
  post,
  type,
  emptySlot,
  headingLevel = 3,
  priority = false,
  detail = "",
  showTags = false,
  sizes = "(max-width: 680px) 90vw, 420px",
}) {
  const H = `h${headingLevel}`;
  if (!post) {
    return (
      <div className="lancet lancet--empty">
        <EmptyState slot={emptySlot} kind={type === "art" ? "night" : "wind"} />
      </div>
    );
  }
  const href = `/${SECTION_PATH[type]}/${post.slug}`;
  const tags = showTags ? toTags(post.tags) : [];
  return (
    <article className="lancet" data-reveal>
      <Link href={href} className="lancet__media" tabIndex={-1} aria-hidden="true">
        <ArchWindow post={post} type={type} ratio="5 / 6" priority={priority} sizes={sizes} />
      </Link>
      <p className="inscr lancet__kind">
        {SECTION_LABEL[type]}
        {detail && <span className="lancet__detail"> · {detail}</span>}
      </p>
      <H className="lancet__title">
        <Link href={href}>{post.title || "Untitled"}</Link>
      </H>
      {post.description && <p className="lancet__desc">{post.description}</p>}
      {tags.length > 0 && (
        <ul className="tag-list" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="tag">{tag}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
