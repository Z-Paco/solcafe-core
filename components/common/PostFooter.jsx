import React from "react";
import Link from "next/link";
import ArchWindow from "../glass/ArchWindow";
import { SECTION_LABEL, SECTION_PATH, formatDate, isoDate } from "@/lib/content";

const href = (post) => `/${SECTION_PATH[post.content_type]}/${post.slug}`;

/** Previous/next within the section, then related posts by tag, each in its own small window. */
export default function PostFooter({ adjacent, related }) {
  const { older, newer } = adjacent;
  return (
    <>
      {(older || newer) && (
        <nav className="post-nav" aria-label="More in this section">
          {older ? (
            <Link href={href(older)} className="post-nav__link post-nav__link--prev" rel="prev">
              <span className="post-nav__dir">
                <span aria-hidden="true">←</span> Older
              </span>
              <span className="post-nav__title">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={href(newer)} className="post-nav__link post-nav__link--next" rel="next">
              <span className="post-nav__dir">
                Newer <span aria-hidden="true">→</span>
              </span>
              <span className="post-nav__title">{newer.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      {related.length > 0 && (
        <aside className="related" aria-labelledby="related-posts-heading">
          <h2 id="related-posts-heading" className="article__section-title">
            Related posts
          </h2>
          <ul className="related__list">
            {related.map((post) => (
              <li key={post.id} className="related__item">
                <Link href={href(post)} className="related__link">
                  <ArchWindow post={post} type={post.content_type} ratio="4 / 5" sizes="(max-width: 700px) 45vw, 200px" className="related__media" />
                  <span className="related__body">
                    <span className="eyebrow">{SECTION_LABEL[post.content_type]}</span>
                    <span className="related__title">{post.title}</span>
                    <time className="meta related__date" dateTime={isoDate(post.created_at)}>
                      {formatDate(post.created_at, true)}
                    </time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
}
