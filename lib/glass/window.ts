import { GLASS, LEAD, bands, pick, rng, sunburst, type Shape } from "./core";
import type { Turbine } from "./panels";

// The hero window: a prairie dawn in glass, 400×560 user units.
// Nature carries the picture; technology stands small on the far horizon.

export const WINDOW = {
  w: 400,
  h: 560,
  inner: "M28 560 L28 262 A234 234 0 0 1 200 34 A234 234 0 0 1 372 262 L372 560 Z",
  outer: "M8 560 L8 258 A256 256 0 0 1 200 8 A256 256 0 0 1 392 258 L392 560 Z",
  fields: "M0 428 C 80 410, 150 412, 220 426 S 340 440, 400 424 L400 560 L0 560Z",
  horizon: "M0 428 C 80 410, 150 412, 220 426 S 340 440, 400 424",
  river:
    "M236 427 C 226 446, 254 458, 230 478 S 184 508, 206 532 S 252 552, 240 560 L 276 560 C 286 548, 238 530, 234 516 S 266 486, 254 470 S 242 442, 248 427 Z",
  rose: { cx: 200, cy: 166, r: 72 },
  saddleBars: [252, 382, 488],
};

const f = (n: number) => n.toFixed(1);

function leaf(x: number, y: number, size: number, deg: number, fill: string): Shape {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const T = (px: number, py: number) => `${f(x + px * c - py * s)} ${f(y + px * s + py * c)}`;
  const w = size * 0.62;
  return {
    kind: "path",
    d: `M${T(0, -size)} Q${T(w, 0)} ${T(0, size)} Q${T(-w, 0)} ${T(0, -size)} Z`,
    fill,
    stroke: LEAD,
    sw: 1.7,
  };
}

function aspen(x: number, top: number, width: number, lean: number): Shape[] {
  const base = 560;
  const mid = (base + top) / 2;
  const out: Shape[] = [
    {
      kind: "path",
      d:
        `M${f(x - width / 2)} ${base} C ${f(x - width / 2 + lean * 0.4)} ${f(mid)}, ${f(x - width / 3 + lean)} ${f(top + 22)}, ${f(x + lean)} ${f(top)}` +
        ` C ${f(x + width / 3 + lean)} ${f(top + 22)}, ${f(x + width / 2 + lean * 0.4)} ${f(mid)}, ${f(x + width / 2)} ${base} Z`,
      fill: "#eef2e8",
      stroke: LEAD,
      sw: 2.2,
    },
  ];
  for (let m = 0; m < 6; m++) {
    // the dark marks on aspen bark
    const yy = base - 26 - m * ((base - top) / 7);
    const off = lean * (1 - (yy - top) / (base - top)) * 0.5;
    out.push({
      kind: "path",
      d: `M${f(x - width / 2 + 2 + off)} ${f(yy)} q ${f(width / 3)} -3 ${f(width * 0.55)} 0`,
      fill: "none",
      stroke: LEAD,
      sw: 1.5,
    });
  }
  return out;
}

export function heroWindow() {
  const R = rng(7);

  const sky = sunburst({
    cx: 232,
    cy: 424,
    rays: 22,
    rings: [0, 30, 58, 92, 134, 184, 244, 318, 420, 560],
    seed: 3,
    a0: Math.PI * 0.96,
    a1: Math.PI * 2.04,
    color: (k, _i, r) =>
      k < 1
        ? GLASS.sun
        : k < 2
          ? pick([GLASS.sun, "#f6e98a"], r)
          : k < 3
            ? pick(["#f8f3a0", "#eef7b4"], r)
            : k < 4
              ? pick(["#e6f5b4", "#d9f0b0", "#f3f7c4"], r)
              : k < 5
                ? pick(["#cdeef9", "#d9f2d0", "#c2e9f8"], r)
                : k < 6
                  ? pick(["#a9dcf6", "#b9e5f8"], r)
                  : k < 7
                    ? pick(["#8fd1f4", GLASS.sky], r)
                    : pick([GLASS.sky, "#5fb6e6", GLASS.skyDeep], r),
  });

  const sun: Shape[] = [
    { kind: "path", d: "M182 426 A50 50 0 0 1 282 426 Z", fill: GLASS.sun, stroke: LEAD, sw: 3 },
    { kind: "path", d: "M206 426 A26 26 0 0 1 258 426 Z", fill: GLASS.sunDeep, stroke: LEAD, sw: 2.4 },
  ];

  // Canola, wheat and pasture in glass
  const fields = bands({
    w: 400,
    y0: 408,
    y1: 560,
    n: 6,
    amp: 9,
    freq: 1.3,
    seed: 21,
    tilt: -26,
    color: (k, _q, r) =>
      pick(
        [
          [GLASS.lime, GLASS.pear],
          [GLASS.sunDeep, GLASS.sun],
          [GLASS.forest, GLASS.lime],
          [GLASS.sunDeep, "#e9d45a"],
          ["#5e8a3c", GLASS.forest],
          ["#4c7330", "#5e8a3c"],
        ][k],
        r
      ),
  });

  // The quiet technology: three turbines and a short solar row, far off
  const turbines: Turbine[] = [
    { x: 306, y: 416, h: 24, blade: 11 },
    { x: 330, y: 420, h: 18, blade: 8.3 },
    { x: 352, y: 418, h: 14, blade: 6.4 },
  ];
  const solar: Shape[] = Array.from({ length: 6 }, (_, i) => ({
    kind: "path" as const,
    d: `M${74 + i * 9} 419h7v3h-7z`,
    fill: "#2f6f9c",
    stroke: LEAD,
    sw: 0.6,
  }));

  // Aspens rise like the columns of a nave; their crowns in autumn gold
  const trunks: Shape[] = [
    ...aspen(58, 292, 13, 6),
    ...aspen(94, 320, 10, -4),
    ...aspen(36, 332, 9, 10),
    ...aspen(342, 294, 13, -6),
    ...aspen(310, 324, 10, 4),
    ...aspen(366, 336, 9, -10),
  ];
  const leaves: Shape[] = [];
  const crown = (cx: number, cy: number, spread: number, n: number) => {
    for (let q = 0; q < n; q++) {
      const ang = R() * Math.PI * 2;
      const rr = Math.sqrt(R()) * spread;
      leaves.push(
        leaf(
          cx + Math.cos(ang) * rr * 1.05,
          cy + Math.sin(ang) * rr * 0.9,
          10 + R() * 9,
          Math.floor(R() * 180),
          pick([GLASS.sunDeep, GLASS.sun, "#e9d45a", GLASS.sunDeep, GLASS.lime, GLASS.pear, "#c5e696", GLASS.sun], R())
        )
      );
    }
  };
  crown(60, 318, 58, 70);
  crown(94, 284, 38, 26);
  crown(340, 318, 58, 70);
  crown(306, 284, 38, 26);

  return { sky, sun, fields, turbines, solar, trunks, leaves };
}
