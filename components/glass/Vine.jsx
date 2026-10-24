import React from "react";
import { GLASS, LEAD } from "@/lib/glass/core";

// The vine down the folio margin: viriditas, the greening of creation.
// One 40×240 tile of stem, leaves and a single bloom, repeated by an SVG
// pattern so it fills any height without JavaScript.

const TILE_H = 240;
const LEAVES = [
  [26, 18, 48, GLASS.lime],
  [14, 50, -48, GLASS.forest],
  [27, 82, 48, GLASS.sunDeep],
  [13, 112, -48, GLASS.pear],
  [26, 146, 48, "#c5e696"],
  [14, 176, -48, GLASS.lime],
  [27, 208, 48, GLASS.forest],
];

function leafPath(x, y, deg, size = 9) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const T = (px, py) => `${(x + px * c - py * s).toFixed(1)} ${(y + px * s + py * c).toFixed(1)}`;
  const w = size * 0.6;
  return `M${T(0, -size)} Q${T(w, 0)} ${T(0, size)} Q${T(-w, 0)} ${T(0, -size)} Z M${T(0, -size)} L${T(0, size)}`;
}

export default function Vine({ className = "" }) {
  return (
    <svg className={className} width="40" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="folio-vine" width="40" height={TILE_H} patternUnits="userSpaceOnUse">
          <path
            d="M20 0 S33 30 20 60 S7 90 20 120 S33 150 20 180 S7 210 20 240"
            fill="none"
            stroke="var(--leaf-ink)"
            strokeWidth="1.3"
            opacity="0.75"
          />
          {LEAVES.map(([x, y, deg, fill]) => (
            <path key={y} d={leafPath(x, y, deg)} fill={fill} stroke={LEAD} strokeWidth="0.8" />
          ))}
          <circle cx="20" cy="120" r="5.5" fill={GLASS.sun} stroke={LEAD} strokeWidth="0.9" />
        </pattern>
      </defs>
      <rect width="40" height="100%" fill="url(#folio-vine)" />
    </svg>
  );
}
