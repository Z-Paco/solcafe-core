import Link from "next/link";
import CopySlot from "@/components/common/CopySlot";
import GlassPanel from "@/components/glass/GlassPanel";
import "./styles/status.css";

export default function NotFound() {
  return (
    <main id="main-content" className="status-page">
      <div className="status-page__inner container">
        <span className="arch-window status-page__window" style={{ "--arch-ratio": "3 / 4" } as React.CSSProperties} aria-hidden="true">
          <span className="arch-window__glass">
            <GlassPanel kind="night" seed={404} width={300} height={400} />
          </span>
        </span>
        <span className="eyebrow">404</span>
        <CopySlot
          id="notFound.heading"
          as="h1"
          size="heading"
          label="Headline"
          fallback="Page not found"
          className="status-page__title"
        />
        <CopySlot id="notFound.body" as="p" size="lede" label="A sentence or two" className="status-page__body" lines={2} />
        <div className="status-page__actions">
          <Link href="/" className="btn btn--primary">
            Back to home
          </Link>
          <Link href="/news" className="btn btn--secondary">
            Read the news
          </Link>
        </div>
      </div>
    </main>
  );
}
