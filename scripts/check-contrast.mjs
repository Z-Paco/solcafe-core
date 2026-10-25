// Contrast gate for the text token pairs in app/styles/globals.css.
// Day = the first :root block. Vespers = Day overlaid with :root[data-theme="dark"].
// Exits 1 if any pair is under its minimum ratio.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/styles/globals.css", import.meta.url), "utf8");

function block(selectorRe) {
  const m = css.match(new RegExp(selectorRe.source + "\\s*\\{([^}]*)\\}", selectorRe.flags));
  if (!m) throw new Error(`block not found: ${selectorRe}`);
  const vars = {};
  for (const [, k, v] of m[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[k] = v.trim();
  return vars;
}

const day = block(/^:root/m);
const vespers = { ...day, ...block(/:root\[data-theme="dark"\]/) };

function resolve(vars, name, depth = 0) {
  const v = vars[name];
  if (v === undefined || depth > 8) throw new Error(`unresolved --${name}`);
  const ref = v.match(/^var\(--([\w-]+)\)$/);
  return ref ? resolve(vars, ref[1], depth + 1) : v;
}

function rgb(hex) {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
}

function lum([r, g, b]) {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function ratio(a, b) {
  const [hi, lo] = [lum(rgb(a)), lum(rgb(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground token, background token, minimum ratio]
const PAIRS = [
  ["ink", "page", 4.5],
  ["ink-soft", "page", 4.5],
  ["ink-soft", "wall", 4.5],
  ["ink", "color-surface", 4.5],
  ["ink-soft", "color-surface", 4.5],
  ["ink", "color-surface-sunk", 4.5],
  ["color-error", "color-surface", 4.5],
  ["gold-ink", "page", 4.5],
  ["leaf-ink", "page", 4.5],
  ["sky-ink", "page", 4.5],
  ["color-accent-text", "color-accent", 4.5],
  ["color-accent-soft-text", "color-accent-soft", 4.5],
  ["color-tag-text", "color-tag-bg", 4.5],
  ["color-highlight-text", "color-highlight", 4.5],
  ["color-error", "color-error-bg", 4.5],
  ["color-success", "color-success-bg", 4.5],
  ["color-warning", "page", 4.5],
  ["color-code-text", "color-code-bg", 4.5],
  ["nave-ink", "nave", 4.5],
  ["color-focus", "page", 3],
  ["color-border-strong", "page", 3],
];

let failed = 0;
for (const [label, vars] of [["Day", day], ["Vespers", vespers]]) {
  console.log(`\n${label}`);
  for (const [fg, bg, min] of PAIRS) {
    let line;
    try {
      const r = ratio(resolve(vars, fg), resolve(vars, bg));
      const ok = r >= min;
      if (!ok) failed++;
      line = `${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(5)} (min ${min})  ${fg} on ${bg}`;
    } catch (e) {
      failed++;
      line = `FAIL  ${fg} on ${bg}: ${e.message}`;
    }
    console.log("  " + line);
  }
}

if (failed) {
  console.error(`\n${failed} pair(s) under minimum.`);
  process.exit(1);
}
console.log("\nAll pairs pass.");
