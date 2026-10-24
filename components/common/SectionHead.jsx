import React from "react";
import Link from "next/link";

/** Section title, a gilded rule ending in a lozenge, and an optional quiet link. */
export default function SectionHead({ id, title, href, linkLabel, as: Tag = "h2" }) {
  return (
    <div className="sec-head">
      <Tag id={id} className="sec-head__title">
        {title}
      </Tag>
      <span className="sec-head__rule" aria-hidden="true" />
      {href ? (
        <Link href={href} className="sec-head__link">
          {linkLabel}
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
