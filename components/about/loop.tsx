// design/AboutPage.dc.html "the loop": a 5-column grid with drawn connectors on tablet and desktop,
// a vertical list on mobile. Connector lines are 1px --color-connector; arrowheads are muted.

const node = "flex flex-col gap-1.5 border border-edge-strong bg-surface px-5 py-4";
const nodeKey = "label text-muted";

const ArrowRight = () => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" className="absolute top-[-4.5px] right-0 text-muted">
    <path d="M1 1l4 4-4 4" />
  </svg>
);
const ArrowUp = ({ className }: { className: string }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" className={`absolute text-muted ${className}`}>
    <path d="M1 5l4-4 4 4" />
  </svg>
);
const ArrowDown = ({ className }: { className: string }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" className={`absolute text-muted ${className}`}>
    <path d="M1 1l4 4 4-4" />
  </svg>
);

function Across({ label, col, row }: { label: string; col: string; row: string }) {
  return (
    <div className={`${col} ${row} flex flex-col justify-center gap-2 px-2.5`}>
      <span className="label text-center text-muted">{label}</span>
      <div className="relative h-px bg-connector">
        <ArrowRight />
      </div>
    </div>
  );
}

const STEPS: { k?: string; v: string; mono?: boolean; conn?: boolean }[] = [
  { k: "claude app", v: "context + research → CONTEXT.md" },
  { conn: true, v: "handoff" },
  { k: "claude design", v: "design passes" },
  { conn: true, v: "screenshots" },
  { k: "review", v: "checks against context" },
  { conn: true, v: "fix prompt → back to claude design · or approved → handoff" },
  { k: "claude code · plan mode", v: "plan, approve, build" },
  { conn: true, v: "build" },
  { k: "you type", v: "› update my context", mono: true },
  { conn: true, v: "back to CONTEXT.md" },
];

export function Loop() {
  return (
    <>
      {/* tablet + desktop: the diagram */}
      <div
        role="img"
        aria-label="claude app writes CONTEXT.md, handoff sends it to claude design, screenshots go to review; review sends a fix prompt back to claude design, or, when approved, a handoff to claude code in plan mode, which builds; you type update my context, and it all goes back to CONTEXT.md."
        className="hidden max-w-280 grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)_96px_minmax(0,1fr)] grid-rows-[auto_96px_auto_80px] t:grid d:grid-cols-[minmax(0,1fr)_128px_minmax(0,1fr)_128px_minmax(0,1fr)]"
      >
        <div className={`col-1 row-1 ${node}`}>
          <span className={nodeKey}>claude app</span>
          <span className="text-15">context + research</span>
          <span className="font-mono text-13">CONTEXT.md</span>
        </div>
        <Across label="handoff" col="col-2" row="row-1" />
        <div className={`col-3 row-1 ${node}`}>
          <span className={nodeKey}>claude design</span>
          <span className="text-15">design passes</span>
        </div>
        <Across label="screenshots" col="col-4" row="row-1" />
        <div className={`col-5 row-1 ${node}`}>
          <span className={nodeKey}>review</span>
          <span className="text-15">checks against context</span>
        </div>

        {/* "back to CONTEXT.md" rises into claude app */}
        <div className="relative col-1 row-[2/5]">
          <div className="absolute top-0 bottom-10 left-1/2 border-l border-connector" />
          <div className="absolute right-0 bottom-10 left-1/2 border-t border-connector" />
          <ArrowUp className="top-0 left-[calc(50%-4.5px)]" />
        </div>
        {/* approved → handoff down into plan mode; fix prompt back up into claude design */}
        <div className="relative col-3 row-2">
          <div className="absolute top-0 bottom-0 left-[30%] border-l border-connector" />
          <ArrowDown className="bottom-0 left-[calc(30%-4.5px)]" />
          {/* kept between the down line (30%) and the fix-prompt line (80%), wrapping if it must */}
          <span className="label absolute top-1/2 right-[calc(20%+12px)] left-[calc(30%+12px)] -translate-y-1/2 leading-meta text-muted">approved · handoff</span>
          <div className="absolute top-0 right-0 left-[80%] h-14 border-b border-l border-connector" />
          <ArrowUp className="top-0 left-[calc(80%-4.5px)]" />
        </div>
        <div className="relative col-4 row-2">
          <div className="absolute inset-x-0 top-0 h-14 border-b border-connector" />
          <span className="label absolute inset-x-0 top-16.5 text-center whitespace-nowrap text-muted">fix prompt</span>
        </div>
        <div className="relative col-5 row-2">
          <div className="absolute top-0 right-1/2 left-0 h-14 border-r border-b border-connector" />
        </div>

        <div className={`col-3 row-3 ${node}`}>
          <span className={nodeKey}>claude code · plan mode</span>
          <span className="text-15">plan, approve, build</span>
        </div>
        <Across label="build" col="col-4" row="row-3" />
        <div className={`col-5 row-3 ${node}`}>
          <span className={nodeKey}>you type</span>
          <span className="font-mono text-14">› update my context</span>
        </div>

        <div className="relative col-[2/5] row-4">
          <div className="absolute inset-x-0 top-0 h-10 border-b border-connector" />
          <span className="label absolute inset-x-0 top-12.5 text-center text-muted">back to CONTEXT.md</span>
        </div>
        <div className="relative col-5 row-4">
          <div className="absolute top-0 right-1/2 left-0 h-10 border-r border-b border-connector" />
        </div>
      </div>

      {/* mobile: the same loop as a list */}
      <ol className="flex flex-col t:hidden">
        {STEPS.map((s, i) =>
          s.conn ? (
            <li key={i} className="flex min-h-13 items-center gap-4 pl-7">
              <div className="relative w-px self-stretch bg-connector">
                <ArrowDown className="bottom-0 -left-[4.5px]" />
              </div>
              <span className="label py-2.5 leading-body text-muted">{s.v}</span>
            </li>
          ) : (
            <li key={i} className={node}>
              <span className={nodeKey}>{s.k}</span>
              <span className={s.mono ? "font-mono text-15" : "text-15"}>{s.v}</span>
            </li>
          ),
        )}
      </ol>
    </>
  );
}
