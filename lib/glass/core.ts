// Stained-glass generators for the "Window of Light" design (design/window-of-light.html).
// Everything here is pure and seeded, so the server renders the same glass every
// time and the client ships no JavaScript for it.

/** Lead lines between the panes. Constant in both themes: lead is lead. */
export const LEAD = "#1b2822";

/** SolCafe's original hues, used as glass. Never re-tint these. */
export const GLASS = {
  sky: "#79c9f4",
  skyDeep: "#4fa6d8",
  lime: "#a9d86e",
  pear: "#bfe94e",
  forest: "#7ca353",
  sun: "#fdfb75",
  sunDeep: "#f3d34a",
} as const;

export type Shape =
  | { kind: "path"; d: string; fill: string; stroke?: string; sw?: number; opacity?: number }
  | { kind: "circle"; cx: number; cy: number; r: number; fill: string; stroke?: string; sw?: number };

/** mulberry32: small, fast, deterministic. */
export function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable numeric seed from a post id or slug (FNV-1a). */
export function seedFrom(value: unknown) {
  const text = String(value ?? "solcafe");
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function pick<T>(list: readonly T[], r: number): T {
  return list[Math.floor(r * list.length) % list.length];
}

const f = (n: number) => n.toFixed(1);
const pt = (p: [number, number]) => `${f(p[0])} ${f(p[1])}`;

/* ---------- sunburst: the sun's rays set the leading (Tiffany / Art Nouveau) ---------- */

type SunburstOptions = {
  cx: number;
  cy: number;
  rays: number;
  rings: number[];
  seed: number;
  a0?: number;
  a1?: number;
  color: (ring: number, ray: number, r: number) => string;
};

export function sunburst(o: SunburstOptions): Shape[] {
  const R = rng(o.seed);
  const a0 = o.a0 ?? Math.PI;
  const a1 = o.a1 ?? Math.PI * 2;
  const angles: number[] = [];
  for (let i = 0; i <= o.rays; i++) {
    const jitter = i && i < o.rays ? (R() - 0.5) * ((a1 - a0) / o.rays) * 0.5 : 0;
    angles.push(a0 + ((a1 - a0) * i) / o.rays + jitter);
  }
  const radii = o.rings.map((ring, k) =>
    angles.map(() => (k ? ring * (1 + (R() - 0.5) * 0.16) : ring))
  );
  const P = (r: number, a: number): [number, number] => [o.cx + r * Math.cos(a), o.cy + r * Math.sin(a)];
  const arcTo = (r1: number, aa: number, r2: number, ab: number) => {
    const am = (aa + ab) / 2;
    const rm = (r1 + r2) / 2 / Math.cos((ab - aa) / 2);
    return ` Q${pt(P(rm, am))} ${pt(P(r2, ab))}`;
  };
  const out: Shape[] = [];
  for (let k = 0; k < o.rings.length - 1; k++) {
    for (let i = 0; i < o.rays; i++) {
      const A = P(radii[k][i], angles[i]);
      const B = P(radii[k + 1][i], angles[i]);
      const D = P(radii[k][i + 1], angles[i + 1]);
      let d = `M${pt(A)} L${pt(B)}`;
      d += arcTo(radii[k + 1][i], angles[i], radii[k + 1][i + 1], angles[i + 1]);
      d += ` L${pt(D)}`;
      if (k) d += arcTo(radii[k][i + 1], angles[i + 1], radii[k][i], angles[i]);
      out.push({ kind: "path", d: `${d} Z`, fill: o.color(k, i, R()) });
    }
  }
  return out;
}

/* ---------- bands: fields and wind streamlines, cut on hand-style diagonals ---------- */

type BandOptions = {
  w: number;
  y0: number;
  y1: number;
  n: number;
  amp: number;
  freq: number;
  seed: number;
  tilt?: number;
  color: (band: number, piece: number, r: number) => string;
};

export function bands(o: BandOptions): Shape[] {
  const R = rng(o.seed);
  const S = 20;
  const curves: [number, number][][] = [];
  for (let i = 0; i <= o.n; i++) {
    const phase = R() * Math.PI * 2;
    const amp = o.amp * (0.6 + R() * 0.8);
    const row: [number, number][] = [];
    for (let j = 0; j <= S; j++) {
      const x = (o.w * j) / S;
      const edge = i && i < o.n ? 1 : 0;
      row.push([
        x,
        o.y0 + ((o.y1 - o.y0) * i) / o.n + Math.sin((x / o.w) * Math.PI * o.freq + phase) * amp * edge + (x / o.w) * (o.tilt ?? 0) * (i / o.n),
      ]);
    }
    curves.push(row);
  }
  const along = (row: [number, number][], from: number, to: number) => {
    let s = "";
    const step = from <= to ? 1 : -1;
    for (let k = from; step > 0 ? k <= to : k >= to; k += step) s += ` L${pt(row[k])}`;
    return s;
  };
  const out: Shape[] = [];
  for (let i = 0; i < o.n; i++) {
    const top = [0];
    const bot = [0];
    const slant = (R() > 0.5 ? 1 : -1) * (1 + Math.floor(R() * 2));
    let c = 0;
    while (c < S) {
      c += 4 + Math.floor(R() * 5);
      if (c >= S - 2) c = S;
      top.push(c);
      bot.push(c === S ? S : Math.max(1, Math.min(S - 1, c + slant)));
    }
    for (let q = 0; q < top.length - 1; q++) {
      const T = curves[i];
      const B = curves[i + 1];
      const d = `M${pt(T[top[q]])}${along(T, top[q] + 1, top[q + 1])}${along(B, bot[q + 1], bot[q])} Z`;
      out.push({ kind: "path", d, fill: o.color(i, q, R()) });
    }
  }
  return out;
}

/* ---------- the rose: spirit above the land ---------- */

export function rose(cx: number, cy: number, R: number, petals = 12) {
  const lw = Math.max(0.55, R * 0.018);
  const P = (r: number, a: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const TAU = Math.PI * 2;
  const ring: Shape[] = [{ kind: "circle", cx, cy, r: R, fill: LEAD }];
  const m = petals * 2;
  for (let i = 0; i < m; i++) {
    // outer crown of small pointed lights
    const aa = (i / m) * TAU - Math.PI / 2;
    const ab = ((i + 1) / m) * TAU - Math.PI / 2;
    const span = ab - aa;
    const d =
      `M${pt(P(R * 0.8, aa))} L${pt(P(R * 0.93, aa + span * 0.12))}` +
      ` Q${pt(P(R * 0.975, aa + span * 0.2))} ${pt(P(R * 0.985, (aa + ab) / 2))}` +
      ` Q${pt(P(R * 0.975, ab - span * 0.2))} ${pt(P(R * 0.93, ab - span * 0.12))}` +
      ` L${pt(P(R * 0.8, ab))} Z`;
    ring.push({ kind: "path", d, fill: i % 2 ? GLASS.sky : GLASS.skyDeep, stroke: LEAD, sw: lw });
  }
  const petalFills = [GLASS.lime, GLASS.sun, GLASS.pear, GLASS.sunDeep];
  for (let i = 0; i < petals; i++) {
    // petals: pointed vesicas
    const a = (i / petals) * TAU - Math.PI / 2;
    const w = (TAU / petals) * 0.42;
    const inner = P(R * 0.27, a);
    const d = `M${pt(inner)} Q${pt(P(R * 0.54, a - w))} ${pt(P(R * 0.76, a))} Q${pt(P(R * 0.54, a + w))} ${pt(inner)} Z`;
    ring.push({ kind: "path", d, fill: petalFills[i % 4], stroke: LEAD, sw: lw });
    const oc = P(R * 0.64, a + TAU / petals / 2);
    ring.push({ kind: "circle", cx: oc[0], cy: oc[1], r: R * 0.065, fill: GLASS.sky, stroke: LEAD, sw: lw });
    const tc = P(R * 0.4, a + TAU / petals / 2);
    ring.push({ kind: "circle", cx: tc[0], cy: tc[1], r: R * 0.04, fill: GLASS.forest, stroke: LEAD, sw: lw * 0.8 });
  }
  const core: Shape[] = [{ kind: "circle", cx, cy, r: R * 0.25, fill: GLASS.sun, stroke: LEAD, sw: lw * 1.2 }];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    core.push({
      kind: "path",
      d: `M${pt(P(R * 0.11, a - 0.3))} L${pt(P(R * 0.23, a))} L${pt(P(R * 0.11, a + 0.3))} Z`,
      fill: GLASS.sunDeep,
      stroke: LEAD,
      sw: lw * 0.7,
    });
  }
  core.push({ kind: "circle", cx, cy, r: R * 0.1, fill: GLASS.sun, stroke: LEAD, sw: lw });
  core.push({ kind: "circle", cx, cy, r: R * 0.995, fill: "none", stroke: LEAD, sw: lw * 2.4 });
  core.push({ kind: "circle", cx, cy, r: R * 0.8, fill: "none", stroke: LEAD, sw: lw * 1.6 });
  return { ring, core };
}

/** A pointed-arch outline inside a w×h box, springing at `spring` (0–1 of height). */
export function archPath(x0: number, y0: number, w: number, h: number, spring = 0.47) {
  const half = w / 2;
  const rise = h * spring;
  // each arc is centred on the springline, so the two meet in a point at the apex
  const r = (half * half + rise * rise) / (2 * half);
  const sy = y0 + rise;
  return `M${f(x0)} ${f(y0 + h)} L${f(x0)} ${f(sy)} A${f(r)} ${f(r)} 0 0 1 ${f(x0 + half)} ${f(y0)} A${f(r)} ${f(r)} 0 0 1 ${f(x0 + w)} ${f(sy)} L${f(x0 + w)} ${f(y0 + h)} Z`;
}
