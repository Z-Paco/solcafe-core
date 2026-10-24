import React from "react";
import Link from "next/link";
import AuthorActions from "./AuthorActions";
import { bylineName, formatDate, isoDate, toTags } from "@/lib/content";

/** Shared header for news / art / engineering detail pages. */
export default function ArticleHeader({
  post,
  backHref,
  backLabel,
  eyebrow,
  editHref,
  noun,
  readMinutes,
  showDek = true,
}) {
  const tags = toTags(post.tags);

  return (
    <header className="article__header">
      <span className="sky-band" aria-hidden="true" />
      <Link href={backHref} className="article__back">
        <span aria-hidden="true">←</span> {backLabel}
      </Link>

      <div className="article__eyebrow-row">
        <span className="eyebrow">{eyebrow}</span>
        {!post.published && <span className="article__draft">Draft</span>}
      </div>

      <h1 className="article__title">{post.title}</h1>

      {showDek && post.description && <p className="article__dek">{post.description}</p>}

      <div className="article__byline">
        <p>
          By <span className="article__author">{bylineName(post.profiles)}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={isoDate(post.created_at)}>
            {formatDate(post.created_at)}
          </time>
          {readMinutes ? (
            <>
              <span aria-hidden="true"> · </span>
              {readMinutes} min read
            </>
          ) : null}
        </p>
        <AuthorActions
          post={{ id: post.id, slug: post.slug, user_id: post.user_id }}
          editHref={editHref}
          afterDeleteHref={backHref}
          noun={noun}
        />
      </div>

      {tags.length > 0 && (
        <ul className="tag-list article__tags" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
