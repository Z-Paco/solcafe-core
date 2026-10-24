import React, { useId } from "react";

// Prairie horizon with a sun, moon, stars and one turbine. Position and
// visibility come from CSS variables set per phase in app/styles/sky.css, so
// the same markup serves dawn, day, dusk and night and animates between them.
const STARS = [
  [58, 36], [112, 70], [176, 28], [236, 58], [304, 24], [352, 66], [420, 40],
  [86, 108], [214, 98], [330, 104], [446, 92],
];

export default function HorizonArt({ className = "", turbine = true }) {
  const id = `horizon-${useId().replace(/:/g, "")}`;
  return (
    <svg
      className={`horizon ${className}`.trim()}
      viewBox="0 0 480 240"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <clipPath id={`${id}-sky`}>
          <rect x="0" y="0" width="480" height="168" />
        </clipPath>
        <mask id={`${id}-moon`}>
          <rect width="480" height="240" fill="#fff" />
          <circle cx="146" cy="82" r="22" fill="#000" />
        </mask>
      </defs>

      <g clipPath={`url(#${id}-sky)`}>
        <g className="horizon__stars" fill="var(--color-heading)">
          {STARS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1.1} />
          ))}
        </g>

        <g className="horizon__moon">
          <circle cx="132" cy="80" r="26" fill="var(--moon-fill)" mask={`url(#${id}-moon)`} />
        </g>

        <g className="horizon__sun">
          <circle cx="240" cy="168" r="34" fill="var(--sun-fill)" />
          <circle cx="240" cy="168" r="58" fill="none" stroke="var(--sun-fill)" strokeWidth="2" opacity="0.5" />
          <circle cx="240" cy="168" r="84" fill="none" stroke="var(--sun-fill)" strokeWidth="1.5" opacity="0.28" />
        </g>
      </g>

      <path d="M0 168h480" stroke="var(--color-heading)" strokeWidth="3" />
      <path d="M40 188h400" stroke="var(--aspen-500)" strokeWidth="3" strokeLinecap="round" />
      <path d="M90 206h300" stroke="var(--aspen-500)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M150 222h180" stroke="var(--aspen-500)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />

      {turbine && (
        <g stroke="var(--color-heading)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M392 168V108" />
          <g className="horizon__blades">
            <path d="M392 108v-28M392 108l25 12M392 108l-23 16" />
          </g>
        </g>
      )}
    </svg>
  );
}
