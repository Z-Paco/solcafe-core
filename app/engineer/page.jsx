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
  title: "Engineering",
  description: copyText("engineer.metaDescription"),
  alternates: { canonical: "/engineer" },
};

const difficultyOf = (post) => {
  const difficulty = asRecord(post.metadata).difficulty;
  return typeof difficulty === "string" ? difficulty.trim() : "";
};

export default async function EngineeringPage() {
  const { posts, error } = await listPublished("engineering");

  return (
    <main id="main-content" className="engineer-index">
      <PageIntro
        eyebrow="Engineering"
        title={<h1 className="page-intro__title">Engineering projects</h1>}
        lede={<CopySlot id="engineer.lede" as="p" size="lede" label="Lede" lines={2} className="page-intro__lede" />}
        actions={<AuthorActions createHref="/write?type=engineer" createLabel="New engineering post" />}
      />

      <div className="container">
        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}

        {!error && posts.length === 0 && <EmptyState slot="engineer.empty" kind="wind" />}

        {posts.length > 0 && (
          <div className={`lancet-gallery${posts.length === 1 ? " lancet-gallery--solo" : ""}`}>
            {posts.map((post, i) => (
              <Lancet
                key={post.id}
                post={post}
                type="engineering"
                headingLevel={2}
                priority={i < 2}
                detail={difficultyOf(post)}
                showTags
                sizes={posts.length === 1 ? "(max-width: 680px) 90vw, 520px" : "(max-width: 680px) 90vw, 360px"}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
