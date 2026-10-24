import React from "react";
import AuthorActions from "@/components/common/AuthorActions";
import Chronicle from "@/components/common/Chronicle";
import CopySlot from "@/components/common/CopySlot";
import PageIntro from "@/components/common/PageIntro";
import { copyText } from "@/content/copy";
import { listPublished } from "@/lib/posts";
import "../styles/collections.css";

export const metadata = {
  title: "News",
  description: copyText("news.metaDescription"),
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const { posts, error } = await listPublished("news");

  return (
    <main id="main-content" className="news-index">
      <PageIntro
        eyebrow="News"
        title={<CopySlot id="news.title" as="h1" size="display" fallback="News" className="page-intro__title" />}
        lede={<CopySlot id="news.lede" as="p" size="lede" label="Lede" lines={2} className="page-intro__lede" />}
        actions={<AuthorActions createHref="/news/create" createLabel="New news post" />}
      />
      <div className="container">
        <Chronicle posts={posts} error={error} headingLevel={2} />
      </div>
    </main>
  );
}
