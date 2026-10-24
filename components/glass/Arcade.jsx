import React from "react";

/**
 * A cloister arcade drawn as a repeating pattern, so the arches keep their
 * shape at any width. Sits on top of the footer.
 */
export default function Arcade({ className = "" }) {
  return (
    <svg className={className} width="100%" height="34" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="cloister-arcade" width="52" height="34" patternUnits="userSpaceOnUse">
          <path
            d="M0.6 34V18Q2.5 5 26 2Q49.5 5 51.4 18V34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="34" fill="url(#cloister-arcade)" />
    </svg>
  );
}
