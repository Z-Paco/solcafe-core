import React from "react";
import Link from "next/link";
import Cover from "./Cover";
import { SECTION_LABEL, SECTION_PATH, formatDate } from "@/lib/content";

const href = (post) => `/${SECTION_PATH[post.content_type]}/${post.slug}`;

/** Previous/next within the section, then related posts by tag. */
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
                  <span className="related__media">
                    <Cover src={post.image_url} sizes="(max-width: 700px) 100vw, 220px" width={480} height={300} markSize={36} />
                  </span>
                  <span className="related__body">
                    <span className="eyebrow">{SECTION_LABEL[post.content_type]}</span>
                    <span className="related__title">{post.title}</span>
                    <time className="related__date" dateTime={post.created_at}>
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
