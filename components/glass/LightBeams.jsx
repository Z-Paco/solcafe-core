"use client";
import React, { useSyncExternalStore } from "react";

// Shafts of coloured light falling from the window across the wall onto the
// words. On wide screens they slant down-left from the window; when the window
// stacks above the text they fall straight down. Decorative only.

const WIDE_QUERY = "(min-width: 961px)";

// colour, opacity at the window, shaft width (viewBox units)
const SHAFTS = [
  ["#79c9f4", 0.85, 2.4],
  ["#79c9f4", 0.6, 1.4],
  ["#c5e696", 0.8, 2.8],
  ["#fdfb75", 0.95, 3.4],
  ["#f3d34a", 0.8, 1.6],
  ["#a9d86e", 0.8, 2.2],
  ["#79c9f4", 0.55, 1.2],
];

function subscribe(onChange) {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export default function LightBeams({ className = "" }) {
  // The server assumes the wide layout; the client corrects it on hydration.
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true
  );

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {SHAFTS.map(([color, alpha], i) => (
          <linearGradient
            key={i}
            id={`light-shaft-${i}`}
            x1={wide ? "1" : "0.5"}
            y1="0"
            x2={wide ? "0.1" : "0.5"}
            y2="1"
          >
            <stop offset="0" stopColor={color} stopOpacity={alpha} />
            <stop offset="0.75" stopColor={color} stopOpacity={alpha * 0.35} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {SHAFTS.map(([, , width], i) => {
        const points = wide
          ? [
              [66, 16 + i * 9.5],
              [66, 16 + i * 9.5 + width * 1.6],
              [4 + i * 7.2 + width * 2.2, 104],
              [4 + i * 7.2, 104],
            ]
          : [
              [22 + i * 8.5, 4],
              [22 + i * 8.5 + width, 4],
              [22 + i * 8.5 + width * 1.8 - i * 2, 104],
              [22 + i * 8.5 - i * 2, 104],
            ];
        return (
          <polygon
            key={i}
            points={points.map((p) => p.join(",")).join(" ")}
            fill={`url(#light-shaft-${i})`}
          />
        );
      })}
    </svg>
  );
}
