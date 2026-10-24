import React from "react";
import Link from "next/link";
import AuthorActions from "@/components/common/AuthorActions";
import Cover from "@/components/common/Cover";
import CopySlot from "@/components/common/CopySlot";
import EmptyState from "@/components/common/EmptyState";
import PageIntro from "@/components/common/PageIntro";
import { copyText } from "@/content/copy";
import { listPublished } from "@/lib/posts";
import {
  asArray,
  asRecord,
  formatDate,
  isoDate,
  readingMinutes,
  toTags,
} from "@/lib/content";
import "../styles/news.css";

export const metadata = {
  title: "News",
  description: copyText("news.metaDescription"),
  alternates: { canonical: "/news" },
};

function leadImage(post) {
  const related = asArray(asRecord(post.metadata).relatedLinks);
  return post.image_url || related[0]?.imageUrl || null;
}

function minutes(post) {
  return readingMinutes(post.description, asRecord(post.metadata).mainContent);
}

function PostMeta({ post }) {
  return (
    <p className="news-meta">
      <time dateTime={isoDate(post.created_at)}>{formatDate(post.created_at)}</time>
      <span aria-hidden="true"> · </span>
      <span>{minutes(post)} min read</span>
    </p>
  );
}

function Tags({ post }) {
  const tags = toTags(post.tags);
  if (tags.length === 0) return null;
  return (
    <ul className="tag-list" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  );
}

export default async function NewsPage() {
  const { posts, error } = await listPublished("news");
  const [lead, ...rest] = posts;
  const side = rest.slice(0, 3);
  const earlier = rest.slice(3);

  return (
    <main id="main-content" className="news-index">
      <div className="container">
        <PageIntro
          eyebrow="News"
          title={<CopySlot id="news.title" as="h1" className="page-intro__title" />}
          lede={<CopySlot id="news.lede" as="p" className="page-intro__lede" lines={2} />}
          actions={<AuthorActions createHref="/news/create" createLabel="New news post" />}
        />

        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}

        {!error && !lead && <EmptyState slot="news.empty" />}

        {lead && (
          <div className={`news-top${side.length === 0 ? " news-top--solo" : ""}`}>
            <article className="news-lead lift" data-reveal>
              <Link
                href={`/news/${lead.slug}`}
                className="news-lead__media zoom"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Cover
                  src={leadImage(lead)}
                  priority
                  width={960}
                  height={600}
                  sizes="(max-width: 900px) 100vw, 640px"
                  markSize={72}
                />
              </Link>
              <div className="news-lead__body">
                <span className="eyebrow">Latest</span>
                <h2 className="news-lead__title">
                  <Link href={`/news/${lead.slug}`}>{lead.title}</Link>
                </h2>
                {lead.description && (
                  <p className="news-lead__teaser">{lead.description}</p>
                )}
                <PostMeta post={lead} />
                <Tags post={lead} />
              </div>
            </article>

            {side.length > 0 && (
              <aside className="news-side" aria-labelledby="news-side-heading">
                <h2 id="news-side-heading" className="news-feed__heading">
                  Also new
                </h2>
                <ol className="news-side__list">
                  {side.map((post, i) => (
                    <li key={post.id} className="news-side__item lift" data-reveal style={{ "--reveal-i": i + 1 }}>
                      <article>
                        <PostMeta post={post} />
                        <h3 className="news-card__title">
                          <Link href={`/news/${post.slug}`}>{post.title}</Link>
                        </h3>
                        {post.description && (
                          <p className="news-card__teaser">{post.description}</p>
                        )}
                      </article>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </div>
        )}

        {earlier.length > 0 && (
          <section className="news-feed" aria-labelledby="news-feed-heading">
            <h2 id="news-feed-heading" className="news-feed__heading">
              Earlier posts
            </h2>
            <ol className="news-feed__list">
              {earlier.map((post) => (
                <li key={post.id} className="news-card" data-reveal>
                  <article>
                    <PostMeta post={post} />
                    <h3 className="news-card__title">
                      <Link href={`/news/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.description && (
                      <p className="news-card__teaser">{post.description}</p>
                    )}
                    <Tags post={post} />
                  </article>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}
