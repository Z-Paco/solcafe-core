import React from "react";
import AuthorActions from "@/components/common/AuthorActions";
import CopySlot from "@/components/common/CopySlot";
import EmptyState from "@/components/common/EmptyState";
import Lancet from "@/components/common/Lancet";
import PageIntro from "@/components/common/PageIntro";
import { copyText } from "@/content/copy";
import { listPublished } from "@/lib/posts";
import { asRecord } from "@/lib/content";
import "../styles/collections.css";

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

  return (
    <main id="main-content" className="art-index">
      <PageIntro
        eyebrow="Art"
        title={<h1 className="page-intro__title">Art gallery</h1>}
        lede={<CopySlot id="art.lede" as="p" size="lede" label="Lede" lines={2} className="page-intro__lede" />}
        actions={<AuthorActions createHref="/write?type=art" createLabel="New art post" />}
      />

      <div className="container">
        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}

        {!error && posts.length === 0 && <EmptyState slot="art.empty" kind="night" />}

        {/* One work stands alone, large; more become a row of lancets. */}
        {posts.length > 0 && (
          <div className={`lancet-gallery${posts.length === 1 ? " lancet-gallery--solo" : ""}`}>
            {posts.map((post, i) => (
              <Lancet
                key={post.id}
                post={post}
                type="art"
                headingLevel={2}
                priority={i < 2}
                detail={mediumOf(post)}
                sizes={posts.length === 1 ? "(max-width: 680px) 90vw, 520px" : "(max-width: 680px) 90vw, 360px"}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
