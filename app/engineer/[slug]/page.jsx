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
  safeImageSrc,
  toParagraphs,
} from "@/lib/content";
import "../../styles/templates/postDetail.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostForViewer("engineering", slug);
  if (!post) return { title: "Not found" };
  const image = safeImageSrc(post.image_url);
  return {
    title: post.title,
    description: excerpt(post.description, 160),
    alternates: { canonical: `/engineer/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: excerpt(post.description, 160),
      ...(image ? { images: [image] } : {}),
    },
    ...(post.published ? {} : { robots: { index: false } }),
  };
}

const text = (v) => (typeof v === "string" ? v.trim() : "");

export default async function EngineeringPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostForViewer("engineering", slug);
  if (!post) notFound();

  const metadata = asRecord(post.metadata);
  const [adjacent, moreLikeThis] = post.published
    ? await Promise.all([getAdjacent(post), getRelated(post)])
    : [{ older: null, newer: null }, []];
  const overview = toParagraphs(metadata.overview);
  const difficulty = text(metadata.difficulty);
  const timeRequired = text(metadata.timeRequired);
  const materials = asArray(metadata.materials).filter((m) => text(m.name));
  const schematics = asArray(metadata.schematics).filter((s) =>
    safeImageSrc(s.url)
  );
  const steps = asArray(metadata.steps).filter(
    (s) => text(s.title) || text(s.description)
  );
  const snippets = asArray(metadata.codeSnippets).filter((s) => text(s.code));

  return (
    <main id="main-content" className="article article--engineering">
      <ReadingProgress />
      <div className="article__container" id="article-body">
        <ArticleHeader
          post={post}
          backHref="/engineer"
          backLabel="All projects"
          eyebrow="Engineering"
          editHref={`/write/engineer/${post.slug}`}
          noun="project"
          readMinutes={readingMinutes(
            post.description,
            metadata.overview,
            ...steps.map((s) => s.description)
          )}
        />

        {(difficulty || timeRequired) && (
          <dl className="article__facts">
            {difficulty && (
              <div>
                <dt>Difficulty</dt>
                <dd className="article__capitalize">{difficulty}</dd>
              </div>
            )}
            {timeRequired && (
              <div>
                <dt>Time required</dt>
                <dd>{timeRequired}</dd>
              </div>
            )}
          </dl>
        )}

        <figure className="article__figure article__figure--wide article__pane" aria-hidden={safeImageSrc(post.image_url) ? undefined : "true"}>
          {safeImageSrc(post.image_url) ? (
            <PostImage src={post.image_url} alt="" className="article__img" priority />
          ) : (
            // no cover: this project's own band of wind glass
            <GlassPanel kind="wind" seed={seedFrom(post.id)} width={640} height={274} />
          )}
        </figure>

        {overview.length > 0 && (
          <section className="article__section" aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="article__section-title">
              Overview
            </h2>
            <div className="article__body">
              {overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {materials.length > 0 && (
          <section className="article__section" aria-labelledby="materials-heading">
            <h2 id="materials-heading" className="article__section-title">
              Materials
            </h2>
            <ul className="article__materials">
              {materials.map((m, i) => (
                <li key={i}>
                  <span>{text(m.name)}</span>
                  {text(m.quantity) && (
                    <span className="article__material-qty">
                      {text(m.quantity)} {text(m.unit)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {schematics.length > 0 && (
          <section className="article__section" aria-labelledby="schematics-heading">
            <h2 id="schematics-heading" className="article__section-title">
              Schematics and diagrams
            </h2>
            <div className="article__gallery">
              {schematics.map((s, i) => (
                <figure key={i} className="article__figure article__frame">
                  <PostImage
                    src={s.url}
                    alt={text(s.caption) || `Schematic ${i + 1}`}
                    className="article__img article__img--natural"
                  />
                  {text(s.caption) && <figcaption>{text(s.caption)}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {steps.length > 0 && (
          <section className="article__section" aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="article__section-title">
              Build steps
            </h2>
            <ol className="article__steps">
              {steps.map((step, i) => (
                <li key={i} className="article__step">
                  {text(step.title) && (
                    <h3 className="article__step-title">{text(step.title)}</h3>
                  )}
                  {safeImageSrc(step.imageUrl) && (
                    <PostImage
                      src={step.imageUrl}
                      alt={`Step ${i + 1}`}
                      className="article__img article__img--natural"
                    />
                  )}
                  {toParagraphs(step.description).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </li>
              ))}
            </ol>
          </section>
        )}

        {snippets.length > 0 && (
          <section className="article__section" aria-labelledby="code-heading">
            <h2 id="code-heading" className="article__section-title">
              Code
            </h2>
            {snippets.map((snippet, i) => (
              <figure key={i} className="code-block">
                {(text(snippet.description) || text(snippet.language)) && (
                  <figcaption className="code-block__header">
                    <span>{text(snippet.description)}</span>
                    {text(snippet.language) && (
                      <span className="code-block__lang">{text(snippet.language)}</span>
                    )}
                  </figcaption>
                )}
                <pre className="code-block__pre" tabIndex={0}>
                  <code>{snippet.code}</code>
                </pre>
              </figure>
            ))}
          </section>
        )}

        <PostFooter adjacent={adjacent} related={moreLikeThis} />
      </div>
    </main>
  );
}
