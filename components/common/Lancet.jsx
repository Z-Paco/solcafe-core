import React from "react";
import Link from "next/link";
import ArchWindow from "../glass/ArchWindow";
import EmptyState from "./EmptyState";
import { SECTION_LABEL, SECTION_PATH } from "@/lib/content";

/**
 * One lancet: a post's arched window with its kind, title and description.
 * Art and engineering stand side by side as twin lancets.
 */
export default function Lancet({ post, type, emptySlot, headingLevel = 3, priority = false }) {
  const H = `h${headingLevel}`;
  if (!post) {
    return (
      <div className="lancet lancet--empty">
        <EmptyState slot={emptySlot} kind={type === "art" ? "night" : "wind"} />
      </div>
    );
  }
  const href = `/${SECTION_PATH[type]}/${post.slug}`;
  return (
    <article className="lancet" data-reveal>
      <Link href={href} className="lancet__media" tabIndex={-1} aria-hidden="true">
        <ArchWindow post={post} type={type} ratio="5 / 6" priority={priority} sizes="(max-width: 680px) 90vw, 420px" />
      </Link>
      <p className="inscr lancet__kind">{SECTION_LABEL[type]}</p>
      <H className="lancet__title">
        <Link href={href}>{post.title}</Link>
      </H>
      {post.description && <p className="lancet__desc">{post.description}</p>}
    </article>
  );
}
