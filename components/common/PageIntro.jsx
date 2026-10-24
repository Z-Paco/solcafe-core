import React from "react";

/**
 * Index-page header: sky band, letter-spaced eyebrow, h1, optional lede and
 * actions. `title` and `lede` are nodes so they can be CopySlots.
 */
export default function PageIntro({ eyebrow, title, lede, actions }) {
  return (
    <header className="page-intro">
      <span className="sky-band" aria-hidden="true" />
      <span className="eyebrow">{eyebrow}</span>
      {title}
      {lede}
      {actions && <div className="page-intro__actions">{actions}</div>}
    </header>
  );
}
