import React, { useId } from "react";

// Small sun-over-the-horizon mark. Inline SVG so it needs no external asset
// and follows the current theme through CSS custom properties.
export default function SunMark({ className = "", size = 28 }) {
  const clipId = `sunmark-${useId().replace(/:/g, "")}`;
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="32" height="21.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="16" cy="20" r="7.5" fill="var(--canola-400)" />
      </g>
      <g stroke="var(--canola-400)" strokeWidth="2" strokeLinecap="round">
        <path d="M16 4.5v3.5M6.2 8.6l2.4 2.4M25.8 8.6l-2.4 2.4M2.5 17h3.5M26 17h3.5" />
      </g>
      <path
        d="M2 22.5h28"
        stroke="var(--color-heading)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 27h16"
        stroke="var(--aspen-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
