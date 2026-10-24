"use client";
import { useEffect, useRef } from "react";

// Hairline in sky colours that fills as the article is read.
export default function ReadingProgress({ targetId = "article-body" }) {
  const bar = useRef(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const el = bar.current;
    if (!target || !el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      el.style.transform = `scaleX(${done})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div className="reading-progress__bar" ref={bar} />
    </div>
  );
}
