import React from "react";

/** Renders Shape[] from lib/glass as SVG. Unset strokes inherit from the parent <g>. */
export default function Shapes({ shapes }) {
  return shapes.map((s, i) =>
    s.kind === "circle" ? (
      <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} stroke={s.stroke} strokeWidth={s.sw} />
    ) : (
      <path key={i} d={s.d} fill={s.fill} stroke={s.stroke} strokeWidth={s.sw} opacity={s.opacity} />
    )
  );
}

/** Small wind turbines; the blades turn slowly in CSS (.rotor), still under reduced motion. */
export function Turbines({ turbines, fill = "#f4f8f1", lead }) {
  return turbines.map((t, i) => {
    const hub = t.y - t.h;
    const base = Math.max(0.9, t.h / 30);
    return (
      <g key={i}>
        <path
          d={`M${t.x - base} ${t.y} L${t.x - base * 0.45} ${hub} L${t.x + base * 0.45} ${hub} L${t.x + base} ${t.y}Z`}
          fill={fill}
          stroke={t.stroke ? lead : undefined}
          strokeWidth={t.stroke}
        />
        <g className="rotor">
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d={`M${t.x} ${hub} l${-base * 0.9} ${-t.blade} l${base * 0.9} ${-base * 1.6} l${base * 0.9} ${base * 1.6}z`}
              fill={fill}
              stroke={t.stroke ? lead : undefined}
              strokeWidth={t.stroke ? t.stroke * 0.8 : undefined}
              transform={`rotate(${deg + 20} ${t.x} ${hub})`}
            />
          ))}
        </g>
      </g>
    );
  });
}
