import React from "react";
import Link from "next/link";
import CopySlot from "@/components/common/CopySlot";
import RoseWindow from "@/components/glass/RoseWindow";
import Vine from "@/components/glass/Vine";
import { copyText } from "@/content/copy";
import "../styles/about.css";

export const metadata = {
  title: "About",
  description: copyText("about.metaDescription"),
  alternates: { canonical: "/about" },
};

// A manuscript folio: rubrics in the margin, a gilded initial on each leaf,
// and a vine growing down the gutter between them.
const LEAVES = [
  { id: "what", heading: "about.what.heading", body: "about.what.body" },
  { id: "find", heading: "about.find.heading", body: "about.find.body" },
  { id: "status", heading: "about.status.heading", body: "about.status.body", action: true },
  { id: "lens", heading: "about.creationCare.heading", body: "about.creationCare.body", paragraphs: true },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="folio-page">
      <header className="folio-head">
        <RoseWindow variant="small" className="folio-head__rose" />
        <CopySlot id="about.title" as="h1" className="folio-head__title" />
      </header>

      <div className="folio container">
        <Vine className="folio__vine" />
        {LEAVES.map((leaf) => (
          <section key={leaf.id} className="folio__section" aria-labelledby={`about-${leaf.id}`} data-reveal>
            <CopySlot
              id={leaf.heading}
              as="h2"
              size="small"
              label="Rubric"
              fallback="Creation care"
              htmlId={`about-${leaf.id}`}
              className="folio__rubric"
            />
            <div className="folio__leaf">
              <CopySlot
                id={leaf.body}
                as="p"
                paragraphs={leaf.paragraphs}
                label="Your section, with sources"
                lines={4}
                className="folio__text"
              />
              {leaf.action && (
                <div className="folio__actions">
                  <Link href="/news" className="btn btn--primary">
                    Browse news
                  </Link>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
