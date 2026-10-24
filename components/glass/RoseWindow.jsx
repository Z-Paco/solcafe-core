import React from "react";
import Shapes from "./Shapes";
import { rose } from "@/lib/glass/core";

const SIZE = { mark: 47, oculus: 47, small: 47, big: 43 };

/**
 * The rose window, drawn in a 100×100 box. `big` adds a glow and turns very
 * slowly (.rose-ring, about five minutes a turn); the others stay still.
 */
export default function RoseWindow({ variant = "mark", className = "", title }) {
  const r = SIZE[variant] ?? 47;
  const { ring, core } = rose(50, 50, r, variant === "mark" ? 8 : 12);
  const big = variant === "big";
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {big && <circle cx="50" cy="50" r="50" fill="url(#glass-halo)" />}
      <g className={big ? "rose-ring" : undefined}>
        <Shapes shapes={ring} />
      </g>
      <Shapes shapes={core} />
    </svg>
  );
}
