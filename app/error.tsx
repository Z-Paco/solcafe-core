"use client";

import { useEffect } from "react";
import Link from "next/link";
import CopySlot from "@/components/common/CopySlot";
import HorizonArt from "@/components/common/HorizonArt";
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
        <HorizonArt className="status-page__art" turbine={false} />
        <span className="eyebrow">Error</span>
        <CopySlot id="error.heading" as="h1" className="status-page__title" />
        <CopySlot id="error.body" as="p" className="status-page__body" lines={2} />
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
