import React from "react";
import Shapes, { Turbines } from "./Shapes";
import { LEAD, rose } from "@/lib/glass/core";
import { WINDOW, heroWindow } from "@/lib/glass/window";

/**
 * The home page window: a prairie dawn in stained glass under a rose.
 * Server-rendered SVG; only the turbine blades and the rose move, in CSS.
 */
export default function HeroWindow({ className = "" }) {
  const { sky, sun, fields, turbines, solar, trunks, leaves } = heroWindow();
  const { ring, core } = rose(WINDOW.rose.cx, WINDOW.rose.cy, WINDOW.rose.r);
  return (
    <svg viewBox={`0 0 ${WINDOW.w} ${WINDOW.h}`} className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="hero-window-glass">
          <path d={WINDOW.inner} />
        </clipPath>
        <clipPath id="hero-window-fields">
          <path d={WINDOW.fields} />
        </clipPath>
      </defs>

      {/* stone frame */}
      <path d={WINDOW.outer} fill="url(#glass-frame)" />

      <g clipPath="url(#hero-window-glass)">
        <rect width={WINDOW.w} height={WINDOW.h} fill={LEAD} />
        <g stroke={LEAD} strokeWidth="2.6" strokeLinejoin="round">
          <Shapes shapes={sky} />
        </g>
        <Shapes shapes={sun} />
        <Turbines turbines={turbines} lead={LEAD} />
        <Shapes shapes={solar} />
        <g clipPath="url(#hero-window-fields)" stroke={LEAD} strokeWidth="2.6" strokeLinejoin="round">
          <Shapes shapes={fields} />
        </g>
        <path d={WINDOW.horizon} fill="none" stroke={LEAD} strokeWidth="3.2" />
        <path d={WINDOW.river} fill="#9fd8f6" stroke={LEAD} strokeWidth="2.6" />
        <Shapes shapes={trunks} />
        <Shapes shapes={leaves} />
        <g className="rose-ring">
          <Shapes shapes={ring} />
        </g>
        <Shapes shapes={core} />
        {/* saddle bars that hold the panels in place */}
        {WINDOW.saddleBars.map((y) => (
          <line key={y} x1="0" y1={y} x2={WINDOW.w} y2={y} stroke={LEAD} strokeWidth="3.4" opacity="0.8" />
        ))}
        <rect width={WINDOW.w} height={WINDOW.h} fill="url(#glass-backlight)" style={{ mixBlendMode: "screen" }} />
      </g>

      <path d={WINDOW.inner} fill="none" stroke={LEAD} strokeWidth="5" />
      <path d={WINDOW.inner} fill="none" stroke="var(--gold)" strokeWidth="1.2" />
      <rect x="2" y="552" width="396" height="8" fill="var(--stone-edge)" />
    </svg>
  );
}
