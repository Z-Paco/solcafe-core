import React from "react";
import Link from "next/link";
import CopySlot from "./CopySlot";
import RoseWindow from "../glass/RoseWindow";
import Arcade from "../glass/Arcade";
import "../../app/styles/footer.css";

const LINKS = [
  { href: "/news", label: "News" },
  { href: "/art", label: "Art" },
  { href: "/engineer", label: "Engineering" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Arcade className="site-footer__arcade" />
      <div className="site-footer__inner container">
        <div className="site-footer__top">
          <Link href="/" className="site-footer__brand" aria-label="SolCafe home">
            <RoseWindow variant="mark" className="site-footer__mark" />
            <span className="site-footer__wordmark">SolCafe</span>
          </Link>
          <nav aria-label="Footer" className="site-footer__nav">
            <ul className="site-footer__links">
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <CopySlot id="footer.line" as="p" className="site-footer__line" label="Footer line" />

        <div className="site-footer__meta">
          <p>&copy; {year} SolCafe</p>
          <Link href="/login" className="site-footer__login">
            Author log in
          </Link>
        </div>
      </div>
    </footer>
  );
}
