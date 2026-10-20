"use client";

import { useState } from "react";
import { parseLine } from "@/lib/lines";
import { LineMark } from "../icons";
import { useCopy } from "./copy";

// design/CLCodePanel.dc.html: label bar + copy, numbered mono lines, ✓/✕ glyphs, bright/dim
// colouring, a right-edge fade when lines don't wrap, and an optional collapse to N lines.

const ROW = 19; // px, the code line height (--leading-code)
const PAD = 36; // px, top + bottom padding of the body

export function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8.5" height="8.5" />
      <path d="M2.5 10.5V2.5h8" />
    </svg>
  );
}

export function CodePanel({
  label,
  lines,
  copyText,
  wrap = false,
  collapsed = 0,
}: {
  label: string;
  lines: string[];
  /** what the copy button copies; defaults to the lines shown */
  copyText?: string;
  wrap?: boolean;
  /** collapse to this many lines with a "show all" toggle (0 = never) */
  collapsed?: number;
}) {
  const { copied, copy } = useCopy();
  const [expanded, setExpanded] = useState(false);
  const canCollapse = collapsed > 0 && lines.length > collapsed;
  const isCollapsed = canCollapse && !expanded;

  return (
    <div className="flex h-full flex-col bg-surface font-mono [--cell-bg:var(--color-surface)]">
      <div className="flex h-12 flex-none items-center justify-between gap-3 border-b border-hairline pl-5">
        <span className="label min-w-0 truncate text-muted">{label}</span>
        <button
          type="button"
          onClick={() => copy(copyText ?? lines.join("\n"))}
          aria-label={copied ? "copied" : `copy ${label}`}
          className="focus-inset flex h-11 min-w-11 flex-none cursor-pointer items-center justify-center px-3.5 text-muted transition-colors hover:text-text"
        >
          {copied ? <span className="label text-text">copied</span> : <CopyIcon />}
        </button>
      </div>

      <div
        className="relative flex-1 overflow-hidden pt-4 pb-5 text-13 leading-code"
        style={isCollapsed ? { maxHeight: collapsed * ROW + PAD } : undefined}
      >
        {lines.map((raw, i) => {
          const line = parseLine(raw, "panel");
          return (
            <div key={i} className="flex min-h-[1lh] gap-4 pl-5">
              <span aria-hidden="true" className="w-5.5 flex-none text-right text-muted select-none">
                {i + 1}
              </span>
              <span
                className={`flex min-w-0 flex-1 gap-2 overflow-hidden pr-5 ${wrap ? "items-start whitespace-pre-wrap" : "items-center whitespace-pre"} ${
                  line.bright ? "text-text" : "text-code-dim"
                }`}
              >
                {line.mark && <LineMark mark={line.mark} className={wrap ? "mt-1.25" : ""} />}
                <span className="min-w-0">{line.text}</span>
              </span>
            </div>
          );
        })}
        {!wrap && <div aria-hidden="true" className="fade-right absolute inset-y-0 right-0 w-12" />}
        {isCollapsed && <div aria-hidden="true" className="fade-up absolute inset-x-0 bottom-0 h-19" />}
      </div>

      {canCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="label focus-inset flex h-11 flex-none cursor-pointer items-center border-t border-hairline px-5 text-left text-text"
        >
          {expanded ? "show less" : `show all · ${lines.length} lines`}
        </button>
      )}
    </div>
  );
}
