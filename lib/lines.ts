// How code-preview lines are coloured, from design/CLCard.dc.html and design/CLCodePanel.dc.html:
// structural lines (headings, frontmatter, brackets, ✕ fails…) are bright, the rest dim.

const CARD_BRIGHT = /^(#|---|\[|✕|Pass |Read |PLAN|timeline|name:)/;
const PANEL_BRIGHT = /^(#|---|\[|✕|→|›|Pass |Read |PLAN|name:)/;

export type Line = { text: string; mark: "x" | "ok" | null; bright: boolean };

export function parseLine(line: string, where: "card" | "panel"): Line {
  const mark = line.startsWith("✕ ") ? "x" : line.startsWith("✓ ") ? "ok" : null;
  return {
    text: mark ? line.slice(2) : line,
    mark,
    bright: (where === "card" ? CARD_BRIGHT : PANEL_BRIGHT).test(line),
  };
}
