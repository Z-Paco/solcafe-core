import React from "react";

/**
 * Gradients shared by every glass drawing on the page, defined once so each
 * window can reference them by id. Rendered by app/layout.tsx.
 */
export default function GlassDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {/* light coming through from behind: brighter at the top of each pane */}
        <linearGradient id="glass-sheen" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="glass-backlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.26" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glass-halo">
          <stop offset="0.55" stopColor="#fdfb75" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fdfb75" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="glass-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--stone)" />
          <stop offset="1" stopColor="var(--stone-edge)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
