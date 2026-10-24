import React from "react";
import Link from "next/link";
import AuthorActions from "@/components/common/AuthorActions";
import Cover from "@/components/common/Cover";
import CopySlot from "@/components/common/CopySlot";
import EmptyState from "@/components/common/EmptyState";
import PageIntro from "@/components/common/PageIntro";
import { copyText } from "@/content/copy";
import { listPublished } from "@/lib/posts";
import { asRecord, formatDate, isoDate, toTags } from "@/lib/content";
import "../styles/engineer.css";

export const metadata = {
  title: "Engineering",
  description: copyText("engineer.metaDescription"),
  alternates: { canonical: "/engineer" },
};

function ProjectCard({ project, lead = false, index = 0 }) {
  const tags = toTags(project.tags);
  const difficulty = asRecord(project.metadata).difficulty;
  const Heading = lead ? "h2" : "h3";

  return (
    <li
      className={`project-card${lead ? " project-card--lead" : ""}`}
      data-reveal
      style={{ "--reveal-i": index % 3 }}
    >
      <article className="project-card__inner lift zoom">
        <div className="project-card__media">
          <Cover
            src={project.image_url}
            className="project-card__img"
            width={lead ? 1100 : 800}
            height={lead ? 620 : 450}
            sizes={lead ? "(max-width: 900px) 100vw, 640px" : "(max-width: 640px) 100vw, 33vw"}
            priority={lead}
          />
        </div>
        <div className="project-card__body">
          <p className="project-card__meta">
            <time dateTime={isoDate(project.created_at)}>
              {formatDate(project.created_at, true)}
            </time>
            {typeof difficulty === "string" && difficulty && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="project-card__difficulty">{difficulty}</span>
              </>
            )}
          </p>
          <Heading className="project-card__title">
            <Link href={`/engineer/${project.slug}`} className="project-card__link">
              {project.title || "Untitled project"}
            </Link>
          </Heading>
          {project.description && (
            <p className="project-card__desc">{project.description}</p>
          )}
          {tags.length > 0 && (
            <ul className="tag-list project-tags" aria-label="Tags">
              {tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </li>
  );
}

export default async function EngineeringPage() {
  const { posts, error } = await listPublished("engineering");
  const [lead, ...rest] = posts;

  return (
    <main id="main-content" className="engineer-index">
      <div className="container">
        <PageIntro
          eyebrow="Engineering"
          title={<h1 className="page-intro__title">Engineering projects</h1>}
          lede={<CopySlot id="engineer.lede" as="p" className="page-intro__lede" lines={2} />}
          actions={
            <AuthorActions createHref="/engineer/create" createLabel="New engineering post" />
          }
        />

        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}

        {!error && posts.length === 0 && <EmptyState slot="engineer.empty" />}

        {lead && (
          <ul className="project-lead-list">
            <ProjectCard project={lead} lead />
          </ul>
        )}

        {rest.length > 0 && (
          <ul className="project-grid">
            {rest.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
