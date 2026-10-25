import React from "react";
import CopySlot from "@/components/common/CopySlot";
import ContactForm from "@/components/common/ContactForm";
import RoseWindow from "@/components/glass/RoseWindow";
import { copyText } from "@/content/copy";
import { CONTACT_EMAIL, reasonFromParam } from "@/lib/contact";
import "../styles/about.css";
import "../styles/contact.css";

export const metadata = {
  title: "Contact",
  description: copyText("contact.metaDescription"),
  alternates: { canonical: "/contact" },
};

// The single front door: questions, publisher requests, corrections and
// collaboration all arrive here. Publishing stays invitation-only
// (public.authors), so the aside explains vetting in the builder's words.
export default async function ContactPage({ searchParams }) {
  const { reason } = await searchParams;

  return (
    <main id="main-content" className="folio-page">
      <header className="folio-head contact-head">
        <RoseWindow variant="small" className="folio-head__rose" />
        <CopySlot id="contact.title" as="h1" size="display" label="Headline" fallback="Contact" className="folio-head__title" />
        <CopySlot id="contact.lede" as="p" size="lede" label="Lede" lines={2} className="contact-head__lede" />
      </header>

      <div className="contact container">
        <section className="contact__desk" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="contact__heading">
            Send a message
          </h2>
          <ContactForm initialReason={reasonFromParam(reason)} />
        </section>

        <aside className="contact__aside" aria-labelledby="contact-publishing">
          <CopySlot
            id="contact.publishing.heading"
            as="h2"
            size="small"
            label="Rubric"
            fallback="Becoming a publisher"
            htmlId="contact-publishing"
            className="contact__rubric"
          />
          <CopySlot
            id="contact.publishing.body"
            as="p"
            paragraphs
            label="What vetting means"
            lines={5}
            className="contact__text"
          />
          <p className="contact__direct">
            <span className="inscr">Or write directly</span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </aside>
      </div>
    </main>
  );
}
