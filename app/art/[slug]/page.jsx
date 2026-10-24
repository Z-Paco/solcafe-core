import React from "react";
import { notFound } from "next/navigation";
import ArticleHeader from "@/components/common/ArticleHeader";
import PostImage from "@/components/common/PostImage";
import PostFooter from "@/components/common/PostFooter";
import ReadingProgress from "@/components/common/ReadingProgress";
import { getAdjacent, getPostForViewer, getRelated } from "@/lib/posts";
import {
  asArray,
  asRecord,
  excerpt,
  safeImageSrc,
  toParagraphs,
} from "@/lib/content";
import "../../styles/templates/postDetail.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostForViewer("art", slug);
  if (!post) return { title: "Not found" };
  const image = safeImageSrc(post.image_url);
  return {
    title: post.title,
    description: excerpt(post.description, 160),
    alternates: { canonical: `/art/${post.slug}` },
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

export default async function ArtPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostForViewer("art", slug);
  if (!post) notFound();

  const metadata = asRecord(post.metadata);
  const [adjacent, moreLikeThis] = post.published
    ? await Promise.all([getAdjacent(post), getRelated(post)])
    : [{ older: null, newer: null }, []];
  const images = asArray(metadata.images).filter((img) => safeImageSrc(img.url));
  const medium = text(metadata.medium);
  const collaborators = text(metadata.collaborators);

  return (
    <main id="main-content" className="article article--art">
      <ReadingProgress />
      <div className="article__container" id="article-body">
        <ArticleHeader
          post={post}
          backHref="/art"
          backLabel="Art gallery"
          eyebrow="Art"
          editHref={`/art/edit/${post.slug}`}
          noun="art post"
          showDek={false}
        />

        {(medium || collaborators) && (
          <dl className="article__facts">
            {medium && (
              <div>
                <dt>Medium</dt>
                <dd>{medium}</dd>
              </div>
            )}
            {collaborators && (
              <div>
                <dt>Collaborators</dt>
                <dd>{collaborators}</dd>
              </div>
            )}
          </dl>
        )}

        {toParagraphs(post.description).length > 0 && (
          <div className="article__body">
            {toParagraphs(post.description).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {images.length > 0 ? (
          <div className="article__gallery">
            {images.map((image, index) => (
              <figure key={index} className="article__figure">
                <PostImage
                  src={image.url}
                  alt={text(image.caption) || `${post.title}, image ${index + 1}`}
                  className="article__img article__img--natural"
                  priority={index === 0}
                />
                {text(image.caption) && <figcaption>{text(image.caption)}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          safeImageSrc(post.image_url) && (
            <figure className="article__figure">
              <PostImage
                src={post.image_url}
                alt={post.title}
                className="article__img article__img--natural"
                priority
              />
            </figure>
          )
        )}

        <PostFooter adjacent={adjacent} related={moreLikeThis} />
      </div>
    </main>
  );
}
