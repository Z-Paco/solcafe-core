import React from "react";
import Link from "next/link";
import ArchWindow from "../glass/ArchWindow";
import EmptyState from "./EmptyState";
import { asRecord, formatDate, isoDate, readingMinutes, toTags } from "@/lib/content";

function Meta({ post }) {
  return (
    <p className="meta">
      <time dateTime={isoDate(post.created_at)}>{formatDate(post.created_at)}</time>
      <span aria-hidden="true"> · </span>
      {readingMinutes(post.description, asRecord(post.metadata).mainContent)} min read
    </p>
  );
}

function Tags({ tags }) {
  const list = toTags(tags);
  if (!list.length) return null;
  return (
    <ul className="tag-list chronicle__tags" aria-label="Tags">
      {list.map((tag) => (
        <li key={tag}>
          <span className="tag">{tag}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The news chronicle: the newest story in an arched window beside its title,
 * then a ruled list of earlier entries. Used on home and on /news.
 */
export default function Chronicle({ posts, error, headingLevel = 3, emptySlot = "news.empty" }) {
  const H = `h${headingLevel}`;
  const [lead, ...rest] = posts;

  if (!lead) {
    return error ? (
      <p className="notice notice--error" role="alert">
        {error}
      </p>
    ) : (
      <EmptyState slot={emptySlot} kind="dawn" />
    );
  }

  return (
    <div className={`chronicle${rest.length ? "" : " chronicle--solo"}`}>
      <article className="chronicle__lead" data-reveal>
        <Link href={`/news/${lead.slug}`} className="chronicle__media" tabIndex={-1} aria-hidden="true">
          <ArchWindow post={lead} type="news" ratio="3 / 4" priority sizes="(max-width: 680px) 80vw, 300px" />
        </Link>
        <div className="chronicle__body">
          <Meta post={lead} />
          <H className="chronicle__lead-title">
            <Link href={`/news/${lead.slug}`}>{lead.title}</Link>
          </H>
          {lead.description && <p className="chronicle__desc">{lead.description}</p>}
          <Tags tags={lead.tags} />
        </div>
      </article>

      {rest.length > 0 && (
        <ol className="chronicle__list">
          {rest.map((post, i) => (
            <li key={post.id} className="chronicle__entry" data-reveal style={{ "--reveal-i": i + 1 }}>
              <article>
                <Meta post={post} />
                <H className="chronicle__entry-title">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </H>
                {post.description && <p className="chronicle__desc">{post.description}</p>}
                <Tags tags={post.tags} />
              </article>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
