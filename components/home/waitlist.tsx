import type { CardData } from "@/lib/content/card";
import { COLS, fillerCount, shownAt, units, type Bp } from "@/lib/grid";
import { Card } from "../card";
import { Mark } from "../icons";

// design/WaitlistHome.dc.html grid: the published drawers, then locked "opens at launch" drawers.
// The export locks 3 cells on mobile and fills desktop to three rows; we keep that and close
// every row at each breakpoint.

const MIN_LOCKED: Record<Bp, number> = { m: 3, t: 2, d: 2 };
const ROWS_D = 3;

function lockedCount(used: number, bp: Bp) {
  const base = bp === "d" ? Math.max(MIN_LOCKED.d, COLS.d * ROWS_D - used) : MIN_LOCKED[bp];
  return base + fillerCount(used + base, bp);
}

export function WaitlistGrid({ cards }: { cards: CardData[] }) {
  const cells = cards.map((c) => ({ wide: c.type === "kit" }));
  const locked = Object.fromEntries((["m", "t", "d"] as Bp[]).map((bp) => [bp, lockedCount(units(cells, bp), bp)])) as Record<Bp, number>;
  const max = Math.max(locked.m, locked.t, locked.d);

  return (
    <>
      <h2 className="sr-only">the first drawers</h2>
      <div className="-mr-px grid grid-cols-1 border-t border-hairline t:grid-cols-2 d:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.slug} card={c} className={`border-r border-b border-hairline ${c.type === "kit" ? "t:col-span-2" : ""}`} />
        ))}
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`min-h-40 items-start border-r border-b border-hairline p-5 t:min-h-109 t:p-6 ${shownAt(i, locked, "flex")}`}
          >
            <p className="label flex h-6 items-center gap-3 text-muted">
              <Mark muted />
              <span>drawer {String(cards.length + i + 1).padStart(2, "0")} — opens at launch</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
