"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One small helper for every scroll fade-in: elements marked [data-reveal]
// get .is-in when they enter the viewport. CSS only hides them when JS is on
// (html[data-js]) and motion is allowed, so nothing is ever stuck invisible.
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]:not(.is-in)");
    if (!targets.length) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("is-in");
            observer.unobserve(el);
            // Once shown, hand the element's transition back to its own
            // hover styles.
            window.setTimeout(() => el.removeAttribute("data-reveal"), 1200);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
