"use client";

import { useEffect } from "react";
import Link from "next/link";
import CopySlot from "@/components/common/CopySlot";
import GlassPanel from "@/components/glass/GlassPanel";
import "./styles/status.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="status-page">
      <div className="status-page__inner container">
        <span className="arch-window status-page__window" style={{ "--arch-ratio": "3 / 4" } as React.CSSProperties} aria-hidden="true">
          <span className="arch-window__glass">
            <GlassPanel kind="night" seed={500} width={300} height={400} />
          </span>
        </span>
        <span className="eyebrow">Error</span>
        <CopySlot
          id="error.heading"
          as="h1"
          size="heading"
          label="Headline"
          fallback="Something went wrong"
          className="status-page__title"
        />
        <CopySlot id="error.body" as="p" size="lede" label="A sentence or two" className="status-page__body" lines={2} />
        <div className="status-page__actions">
          <button type="button" className="btn btn--primary" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn btn--secondary">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
