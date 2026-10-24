import React from "react";
import Shapes, { Turbines } from "./Shapes";
import { LEAD } from "@/lib/glass/core";
import { panel } from "@/lib/glass/panels";

/**
 * A stained-glass panel that fills its parent. Used in place of a cover image,
 * seeded by the post so each post keeps its own window.
 */
export default function GlassPanel({ kind = "dawn", seed = 1, width = 300, height = 400, className = "" }) {
  const { shapes, turbines } = panel(kind, width, height, seed);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={`glass-panel ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={LEAD} strokeWidth="2.4" strokeLinejoin="round">
        <Shapes shapes={shapes} />
      </g>
      <Turbines turbines={turbines} lead={LEAD} />
      <rect width={width} height={height} fill="url(#glass-sheen)" style={{ mixBlendMode: "screen" }} />
    </svg>
  );
}
