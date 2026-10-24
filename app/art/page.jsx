import React from "react";
import Link from "next/link";
import AuthorActions from "@/components/common/AuthorActions";
import Cover from "@/components/common/Cover";
import CopySlot from "@/components/common/CopySlot";
import EmptyState from "@/components/common/EmptyState";
import PageIntro from "@/components/common/PageIntro";
import { copyText } from "@/content/copy";
import { listPublished } from "@/lib/posts";
import { asRecord, formatDate } from "@/lib/content";
import "../styles/art.css";

export const metadata = {
  title: "Art",
  description: copyText("art.metaDescription"),
  alternates: { canonical: "/art" },
};

const mediumOf = (post) => {
  const medium = asRecord(post.metadata).medium;
  return typeof medium === "string" ? medium.trim() : "";
};

export default async function ArtPage() {
  const { posts, error } = await listPublished("art");
  const [first] = posts;

  return (
    <main id="main-content" className="art-index">
      <div className="container">
        <PageIntro
          eyebrow="Art"
          title={<h1 className="page-intro__title">Art gallery</h1>}
          lede={<CopySlot id="art.lede" as="p" className="page-intro__lede" lines={2} />}
          actions={<AuthorActions createHref="/art/create" createLabel="New art post" />}
        />

        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}

        {!error && posts.length === 0 && <EmptyState slot="art.empty" />}

        {/* One work: shown large, framed like an exhibit. */}
        {posts.length === 1 && (
          <Link href={`/art/${first.slug}`} className="art-exhibit lift zoom" data-reveal>
            <span className="art-exhibit__frame">
              <span className="art-exhibit__mat">
                <Cover
                  src={first.image_url}
                  className="art-exhibit__img"
                  width={1200}
                  height={900}
                  sizes="(max-width: 900px) 100vw, 720px"
                  priority
                  markSize={96}
                />
              </span>
            </span>
            <span className="art-exhibit__plaque">
              <span className="art-exhibit__title">{first.title}</span>
              {mediumOf(first) && <span className="art-exhibit__medium">{mediumOf(first)}</span>}
              <time className="art-exhibit__date" dateTime={first.created_at}>
                {formatDate(first.created_at)}
              </time>
            </span>
          </Link>
        )}

        {/* Two or more: a masonry that keeps growing gracefully. */}
        {posts.length > 1 && (
          <ul className="art-masonry">
            {posts.map((post, i) => (
              <li key={post.id} className="art-card" data-reveal style={{ "--reveal-i": i % 3 }}>
                <Link href={`/art/${post.slug}`} className="art-card__link lift zoom">
                  <span className={`art-card__media art-card__media--${i % 3}`}>
                    <Cover
                      src={post.image_url}
                      className="art-card__img"
                      width={800}
                      height={1000}
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </span>
                  <span className="art-card__caption">
                    <span className="art-card__title">{post.title}</span>
                    {mediumOf(post) && <span className="art-card__medium">{mediumOf(post)}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
