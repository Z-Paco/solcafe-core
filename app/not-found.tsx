import Link from "next/link";
import CopySlot from "@/components/common/CopySlot";
import HorizonArt from "@/components/common/HorizonArt";
import "./styles/status.css";

export default function NotFound() {
  return (
    <main id="main-content" className="status-page">
      <div className="status-page__inner container">
        <HorizonArt className="status-page__art" />
        <span className="eyebrow">404</span>
        <CopySlot id="notFound.heading" as="h1" className="status-page__title" />
        <CopySlot id="notFound.body" as="p" className="status-page__body" lines={2} />
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
