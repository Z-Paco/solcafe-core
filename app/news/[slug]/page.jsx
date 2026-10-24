import React from "react";
import { notFound } from "next/navigation";
import ArticleHeader from "@/components/common/ArticleHeader";
import PostImage from "@/components/common/PostImage";
import PostFooter from "@/components/common/PostFooter";
import ReadingProgress from "@/components/common/ReadingProgress";
import GlassPanel from "@/components/glass/GlassPanel";
import { seedFrom } from "@/lib/glass/core";
import { getAdjacent, getPostForViewer, getRelated } from "@/lib/posts";
import {
  asArray,
  asRecord,
  excerpt,
  readingMinutes,
  safeHref,
  safeImageSrc,
  sourceDomain,
  toParagraphs,
} from "@/lib/content";
import "../../styles/templates/postDetail.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostForViewer("news", slug);
  if (!post) return { title: "Not found" };
  const image = safeImageSrc(post.image_url);
  return {
    title: post.title,
    description: excerpt(post.description, 160),
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: excerpt(post.description, 160),
      publishedTime: post.created_at,
      ...(image ? { images: [image] } : {}),
    },
    ...(post.published ? {} : { robots: { index: false } }),
  };
}

/** Link titles are sometimes saved as the raw URL; show the domain instead. */
function linkTitle(link) {
  const title = typeof link.title === "string" ? link.title.trim() : "";
  if (!title || /^https?:\/\//i.test(title)) return sourceDomain(link.url);
  return title;
}

export default async function NewsPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostForViewer("news", slug);
  if (!post) notFound();

  const metadata = asRecord(post.metadata);
  const paragraphs = toParagraphs(metadata.mainContent);
  const quotes = asArray(metadata.quotes).filter(
    (q) => typeof q.text === "string" && q.text.trim()
  );
  const sources = asArray(metadata.sources).filter((s) => safeHref(s.url));
  const related = asArray(metadata.relatedLinks).filter((l) => safeHref(l.url));
  const epigraph = asRecord(metadata.epigraph);
  const hasEpigraph = typeof epigraph.text === "string" && epigraph.text.trim();
  const cover = post.image_url || related[0]?.imageUrl || null;
  const [adjacent, moreLikeThis] = post.published
    ? await Promise.all([getAdjacent(post), getRelated(post)])
    : [{ older: null, newer: null }, []];

  return (
    <main id="main-content" className="article article--news">
      <ReadingProgress />
      <div className="article__container">
        <ArticleHeader
          post={post}
          backHref="/news"
          backLabel="All news"
          eyebrow="News"
          editHref={`/news/edit/${post.slug}`}
          noun="news post"
          readMinutes={readingMinutes(post.description, metadata.mainContent)}
        />

        {hasEpigraph && (
          <figure className="article__epigraph">
            <blockquote>
              <p>{epigraph.text}</p>
            </blockquote>
            {epigraph.source && (
              <figcaption>
                {safeHref(epigraph.url) ? (
                  <a href={safeHref(epigraph.url)} target="_blank" rel="noopener noreferrer">
                    {epigraph.source}
                  </a>
                ) : (
                  epigraph.source
                )}
              </figcaption>
            )}
          </figure>
        )}

        <figure className="article__figure article__figure--wide article__pane" aria-hidden={safeImageSrc(cover) ? undefined : "true"}>
          {safeImageSrc(cover) ? (
            <PostImage src={cover} alt="" className="article__img" priority />
          ) : (
            // no cover: this post's own band of dawn glass
            <GlassPanel kind="dawn" seed={seedFrom(post.id)} width={640} height={274} />
          )}
        </figure>

        <div className="article__layout" id="article-body">
          {paragraphs.length > 0 && (
            <div className="article__body article__body--dropcap">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <span className="fleuron" aria-hidden="true">
                ❧
              </span>
            </div>
          )}

          {(quotes.length > 0 || sources.length > 0) && (
            <aside className="article__margin" aria-label="Quotes and sources">
              {quotes.length > 0 && (
                <section className="article__notes" aria-label="Key quotes">
                  {quotes.map((quote, i) => (
                    <figure key={i} className="article__pullquote">
                      <blockquote>
                        <p>{quote.text.trim()}</p>
                      </blockquote>
                      {typeof quote.attribution === "string" &&
                        quote.attribution.trim() && (
                          <figcaption>{quote.attribution.trim()}</figcaption>
                        )}
                    </figure>
                  ))}
                </section>
              )}

              {sources.length > 0 && (
                <section className="article__notes" aria-labelledby="sources-heading">
                  <h2 id="sources-heading" className="article__section-title">
                    Sources
                  </h2>
                  <ol className="article__sources">
                    {sources.map((source, i) => (
                      <li key={i}>
                        <a href={safeHref(source.url)} target="_blank" rel="noopener noreferrer">
                          {typeof source.name === "string" && source.name.trim()
                            ? source.name.trim()
                            : sourceDomain(source.url)}
                        </a>
                        <span className="article__source-domain">
                          {sourceDomain(source.url)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <section className="article__section" aria-labelledby="related-heading">
            <h2 id="related-heading" className="article__section-title">
              Related links
            </h2>
            <ul className="link-cards">
              {related.map((link, i) => (
                <li key={i} className="link-card">
                  <a
                    href={safeHref(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-card__link"
                  >
                    {safeImageSrc(link.imageUrl) && (
                      <span className="link-card__media">
                        <PostImage
                          src={link.imageUrl}
                          alt=""
                          width={480}
                          height={270}
                          className="link-card__img"
                        />
                      </span>
                    )}
                    <span className="link-card__body">
                      <span className="link-card__domain">
                        {sourceDomain(link.url)}
                      </span>
                      <span className="link-card__title">{linkTitle(link)}</span>
                      {typeof link.comment === "string" && link.comment.trim() && (
                        <span className="link-card__comment">
                          {link.comment.trim()}
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <PostFooter adjacent={adjacent} related={moreLikeThis} />
      </div>
    </main>
  );
}
