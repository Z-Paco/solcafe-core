import { GLASS, LEAD, bands, pick, rng, sunburst, type Shape } from "./core";

export type PanelKind = "dawn" | "night" | "wind";

/** A small wind turbine standing at (x, y), `h` tall. Blades turn in CSS (.rotor). */
export type Turbine = { x: number; y: number; h: number; blade: number; stroke?: number };

export type Panel = { shapes: Shape[]; turbines: Turbine[] };

/** Which glass a post gets when it has no image of its own. */
export const PANEL_FOR: Record<string, PanelKind> = {
  news: "dawn",
  art: "night",
  engineering: "wind",
};

/**
 * Glass for a post panel, `w`×`h` user units. `seed` varies the cut of the
 * glass so each post gets its own window while keeping the composition.
 */
export function panel(kind: PanelKind, w: number, h: number, seed: number): Panel {
  const shapes: Shape[] = [{ kind: "path", d: `M0 0H${w}V${h}H0Z`, fill: LEAD }];
  const turbines: Turbine[] = [];

  if (kind === "dawn") {
    shapes.push(
      ...sunburst({
        cx: w * 0.6,
        cy: h * 0.7,
        rays: 16,
        rings: [0, 34, 62, 98, 140, 196, 270, 380].map((r) => (r * w) / 300),
        seed: seed ^ 11,
        a0: Math.PI * 0.98,
        a1: Math.PI * 2.02,
        color: (k, _i, r) =>
          k < 1
            ? GLASS.sun
            : k < 2
              ? pick([GLASS.sun, "#f6e98a"], r)
              : k < 3
                ? pick(["#eef7b4", "#e1f3a6"], r)
                : k < 4
                  ? pick(["#c9ecf9", "#d8f1c4", "#b9e5f8"], r)
                  : k < 5
                    ? pick(["#9ad6f5", "#b0e0f7"], r)
                    : pick([GLASS.sky, "#5fb6e6", GLASS.skyDeep], r),
      }),
      ...bands({
        w,
        y0: h * 0.7,
        y1: h,
        n: 4,
        amp: 10,
        freq: 1.4,
        seed: seed ^ 5,
        tilt: -18,
        color: (i, _q, r) =>
          pick(
            [
              [GLASS.lime, GLASS.sunDeep],
              [GLASS.forest, GLASS.pear],
              [GLASS.sunDeep, GLASS.lime],
              ["#5e8a3c", GLASS.forest],
            ][i],
            r
          ),
      })
    );
  }

  if (kind === "night") {
    const mx = w * 0.66;
    const my = h * 0.3;
    shapes.push(
      ...sunburst({
        cx: mx,
        cy: my,
        rays: 14,
        rings: [0, 26, 52, 88, 132, 190, 260, 360].map((r) => (r * w) / 300),
        seed: seed ^ 29,
        a0: 0,
        a1: Math.PI * 2,
        color: (k, _i, r) =>
          k < 1
            ? "#f4f0d2"
            : k < 2
              ? pick(["#e9e2c0", "#d8d0f0"], r)
              : k < 3
                ? pick(["#8a6cc8", "#7a5cb8"], r)
                : k < 5
                  ? pick(["#5a3490", "#4a2f86", "#6e3f9e"], r)
                  : pick(["#3c2a7a", "#2f6f9c", "#2a1b55"], r),
      }),
      { kind: "circle", cx: mx + (11 * w) / 300, cy: my - (8 * w) / 300, r: (21 * w) / 300, fill: "#5a3490", stroke: LEAD, sw: 2 }
    );
    const R = rng(seed ^ 41);
    for (let i = 0; i < 6; i++) {
      const sx = w * (0.08 + R() * 0.84);
      const sy = h * (0.08 + R() * 0.5);
      if (Math.hypot(sx - mx, sy - my) < w * 0.16) continue;
      shapes.push({
        kind: "path",
        d: `M${sx.toFixed(1)} ${(sy - 6).toFixed(1)} l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z`,
        fill: GLASS.sun,
        stroke: LEAD,
        sw: 0.8,
      });
    }
    shapes.push(
      ...bands({
        w,
        y0: h * 0.78,
        y1: h,
        n: 3,
        amp: 9,
        freq: 1.2,
        seed: seed ^ 8,
        color: (_i, _q, r) => pick(["#2a1b55", "#24164a", "#3a2470"], r),
      })
    );
  }

  if (kind === "wind") {
    // wind streamlines become the leading: the engineering, drawn as beauty
    shapes.push(
      ...bands({
        w,
        y0: -10,
        y1: h * 0.8,
        n: 7,
        amp: 22,
        freq: 2.2,
        seed: seed ^ 47,
        color: (i, _q, r) =>
          i < 2
            ? pick([GLASS.skyDeep, "#5fb6e6"], r)
            : i < 4
              ? pick([GLASS.sky, "#9ad6f5"], r)
              : i < 6
                ? pick(["#b9e5f8", "#bff6fa", "#9fe3ec"], r)
                : pick(["#d8fafc", "#eef7b4"], r),
      }),
      ...bands({
        w,
        y0: h * 0.8,
        y1: h,
        n: 3,
        amp: 7,
        freq: 1.3,
        seed: seed ^ 6,
        color: (_i, _q, r) => pick([GLASS.forest, GLASS.lime, GLASS.sunDeep], r),
      })
    );
    turbines.push(
      { x: w * 0.7, y: h * 0.8, h: (64 * w) / 300, blade: (27 * w) / 300, stroke: 1 },
      { x: w * 0.84, y: h * 0.81, h: (46 * w) / 300, blade: (19 * w) / 300, stroke: 1 }
    );
  }

  return { shapes, turbines };
}
