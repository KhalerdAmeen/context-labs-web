// The drawer grid: 1 / 2 / 4 columns at m / t / d, kits span 2 (never more than the row).
// Empty "filler" cells close the last row so every cell keeps its right and bottom hairline.

export const COLS = { m: 1, t: 2, d: 4 } as const;
export type Bp = keyof typeof COLS;

/** Grid units a set of cells takes at a breakpoint, where `wide` cells span 2. */
export function units(cells: { wide: boolean }[], bp: Bp) {
  return cells.reduce((n, c) => n + (c.wide ? Math.min(2, COLS[bp]) : 1), 0);
}

/** Empty cells needed to finish the last row. */
export function fillerCount(totalUnits: number, bp: Bp) {
  const cols = COLS[bp];
  return (cols - (totalUnits % cols)) % cols;
}

/**
 * Classes that show the i-th of up to max(counts) cells only at breakpoints whose count is > i.
 * e.g. counts {m:0, t:1, d:3}: cell 0 → "hidden t:block", cell 2 → "hidden d:block".
 */
// Literal class names only — Tailwind can't see classes built with template strings.
const SHOW = {
  block: { m: "block", t: "t:block", d: "d:block" },
  flex: { m: "flex", t: "t:flex", d: "d:flex" },
} as const;
const HIDE = { m: "hidden", t: "t:hidden", d: "d:hidden" } as const;

export function shownAt(i: number, counts: Record<Bp, number>, display: keyof typeof SHOW = "block") {
  const on = (bp: Bp) => i < counts[bp];
  const m = on("m") ? SHOW[display].m : HIDE.m;
  const t = on("t") === on("m") ? "" : on("t") ? SHOW[display].t : HIDE.t;
  const d = on("d") === on("t") ? "" : on("d") ? SHOW[display].d : HIDE.d;
  return [m, t, d].filter(Boolean).join(" ");
}
