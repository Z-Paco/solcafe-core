import React from "react";
import Link from "next/link";
import CopySlot from "./CopySlot";
import GlassPanel from "../glass/GlassPanel";

/** A small lancet of glass and the section's empty-state copy slot. */
export default function EmptyState({ slot, href, label, role, kind = "dawn" }) {
  return (
    <div className="empty-state" role={role}>
      <span className="arch-window empty-state__window" style={{ "--arch-ratio": "3 / 4" }} aria-hidden="true">
        <span className="arch-window__glass">
          <GlassPanel kind={kind} seed={7} width={300} height={400} />
        </span>
      </span>
      <CopySlot id={slot} as="p" className="empty-state__text" lines={2} />
      {href && (
        <Link href={href} className="btn btn--secondary btn--sm">
          {label}
        </Link>
      )}
    </div>
  );
}
