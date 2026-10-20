"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CardData } from "@/lib/content/card";
import { TOOLS, type Tool } from "@/lib/content/tools";
import { fillerCount, shownAt, units, type Bp } from "@/lib/grid";
import { Card, cellArrow } from "../card";
import { ArrowUpRight, Mark } from "../icons";

// design/ContextLabsHome.dc.html (filters, grid, submit tile) + the empty state in
// design/SystemStates.dc.html. Filter state lives in the URL (?type=kit&tool=claude-code) so a
// filtered view can be shared; it's written with history.replaceState, which Next syncs with
// useSearchParams without a server round trip.

type TypeKey = "all" | CardData["type"];
const TYPES: [TypeKey, string][] = [
  ["all", "All"],
  ["kit", "Kits"],
  ["skill", "Skills"],
  ["context", "Context"],
];
const TOOL_LABEL: Record<Tool, string> = { "claude app": "Claude app", "claude code": "Claude Code", "claude design": "Claude Design" };
const toolSlug = (t: Tool) => t.replace(" ", "-");

function parse(params: URLSearchParams): { type: TypeKey; tool: Tool | null } {
  const type = TYPES.find(([k]) => k === params.get("type"))?.[0] ?? "all";
  const tool = TOOLS.find((t) => toolSlug(t) === params.get("tool")) ?? null;
  return { type, tool };
}

/** Reads the filters from the URL. Must render inside <Suspense>; the fallback is the unfiltered view. */
export function Library({ cards }: { cards: CardData[] }) {
  const { type, tool } = parse(useSearchParams());
  const set = (next: { type: TypeKey; tool: Tool | null }) => {
    const p = new URLSearchParams();
    if (next.type !== "all") p.set("type", next.type);
    if (next.tool) p.set("tool", toolSlug(next.tool));
    const q = p.toString();
    window.history.replaceState(null, "", q ? `?${q}` : window.location.pathname);
  };
  return (
    <LibraryView
      cards={cards}
      type={type}
      tool={tool}
      onType={(t) => set({ type: t, tool })}
      onTool={(t) => set({ type, tool: tool === t ? null : t })}
    />
  );
}

type ViewProps = {
  cards: CardData[];
  type: TypeKey;
  tool: Tool | null;
  onType?: (t: TypeKey) => void;
  onTool?: (t: Tool) => void;
};

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`focus-inset relative h-12 flex-none cursor-pointer px-3.5 text-14 transition-colors ${active ? "text-accent" : "text-muted hover:text-text"}`}
    >
      {label}
      {active && <span className="absolute inset-x-3.5 bottom-0 h-0.5 bg-accent" />}
    </button>
  );
}

export function LibraryView({ cards, type, tool, onType, onTool }: ViewProps) {
  const shown = cards.filter((c) => (type === "all" || c.type === type) && (!tool || c.tools.includes(tool)));

  // the submit tile spans like a kit; fillers close the last row at each breakpoint
  const cells = [...shown.map((c) => ({ wide: c.type === "kit" })), { wide: true }];
  const fill = Object.fromEntries((["m", "t", "d"] as Bp[]).map((bp) => [bp, fillerCount(units(cells, bp), bp)])) as Record<Bp, number>;
  const maxFill = Math.max(fill.m, fill.t, fill.d);

  return (
    <>
      <div role="group" aria-label="filter the library" className="no-scrollbar flex items-stretch overflow-x-auto border-y border-hairline px-1.5 whitespace-nowrap t:px-2.5">
        {TYPES.map(([k, label]) => (
          <FilterButton key={k} label={label} active={type === k} onClick={onType && (() => onType(k))} />
        ))}
        <span aria-hidden="true" className="mx-3 my-3.5 w-px flex-none bg-divider" />
        {TOOLS.map((t) => (
          <FilterButton key={t} label={TOOL_LABEL[t]} active={tool === t} onClick={onTool && (() => onTool(t))} />
        ))}
      </div>

      {shown.length === 0 ? (
        <Empty type={type} tool={tool} />
      ) : (
        <div className="-mr-px grid grid-flow-row-dense grid-cols-1 t:grid-cols-2 d:grid-cols-4">
          {shown.map((c) => (
            <Card key={c.slug} card={c} className={`border-r border-b border-hairline ${c.type === "kit" ? "t:col-span-2" : ""}`} />
          ))}
          <Link
            href="/submit"
            className="cell group relative z-1 -mt-px -ml-px flex min-h-55 flex-col border border-dashed border-edge-strong p-5 focus-visible:z-3 t:col-span-2 t:min-h-80 t:p-6"
          >
            <div className="h-6" />
            <ArrowUpRight className={cellArrow} />
            <span className="mt-5 text-20 leading-card font-medium tracking-heading">your context here</span>
            <span className="mt-2 max-w-30ch text-15 leading-body text-pretty text-muted">built something good? submit the file behind it.</span>
          </Link>
          {Array.from({ length: maxFill }, (_, i) => (
            <div key={i} aria-hidden="true" className={`border-r border-b border-hairline ${shownAt(i, fill)}`} />
          ))}
        </div>
      )}
    </>
  );
}

function Empty({ type, tool }: { type: TypeKey; tool: Tool | null }) {
  const what = [type !== "all" && TYPES.find(([k]) => k === type)![1].toLowerCase(), tool].filter(Boolean).join(" · ");
  return (
    <div className="flex min-h-90 flex-col items-start justify-center gap-4 border-b border-hairline px-6 py-12">
      <p className="label flex h-6 items-center gap-3 text-muted">
        <Mark muted />
        <span>0 entries · {what}</span>
      </p>
      <p className="text-28 font-medium tracking-heading">nothing here yet.</p>
      <Link href="/submit" className="inline-flex h-11 items-center gap-2 text-15 underline underline-offset-4">
        submit the first one <ArrowUpRight size={10} strokeWidth={1.8} />
      </Link>
    </div>
  );
}
