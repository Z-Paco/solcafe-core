import React from "react";
import RoseWindow from "../glass/RoseWindow";

/**
 * Index-page header on the wall: a small rose, an inscription, the h1, an
 * optional lede and actions. `title` and `lede` are nodes so they can be CopySlots.
 */
export default function PageIntro({ eyebrow, title, lede, actions }) {
  return (
    <header className="page-intro">
      <div className="page-intro__inner container">
        <RoseWindow variant="small" className="page-intro__rose" />
        <span className="eyebrow">{eyebrow}</span>
        {title}
        {lede}
        {actions && <div className="page-intro__actions">{actions}</div>}
      </div>
    </header>
  );
}
