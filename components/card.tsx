import Link from "next/link";
import type { CardData } from "@/lib/content/card";
import { parseLine } from "@/lib/lines";
import { TypeBadge } from "./badge";
import { ArrowUpRight, LineMark } from "./icons";

// design/CLCard.dc.html — one drawer. Hover (and keyboard focus) lifts the cell to surface,
// slides the arrow up-right in accent, and drops the preview's fade by two lines.

export const cellArrow =
  "absolute top-7.25 right-6 text-muted transition-[color,translate] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:text-accent";

export function Card({ card, className = "" }: { card: CardData; className?: string }) {
  return (
    <Link href={card.href} className={`cell group relative flex flex-col p-5 focus-visible:z-3 t:p-6 ${className}`}>
      <div className="flex h-6 items-center">
        <TypeBadge type={card.type} />
      </div>
      <ArrowUpRight className={cellArrow} />
      <h3 className="mt-5 pr-6 text-20 leading-card font-medium tracking-heading">{card.title}</h3>
      <p className="mt-2 line-clamp-3 h-[4.5em] max-w-56ch text-15 leading-body text-pretty text-muted">{card.desc}</p>

      <div aria-hidden="true" className="relative mt-6 h-[7lh] overflow-hidden font-mono text-13 leading-code">
        {card.preview.map((raw, i) => {
          const line = parseLine(raw, "card");
          return (
            <div key={i} className={`flex h-[1lh] items-center gap-2 overflow-hidden whitespace-pre ${line.bright ? "text-text" : "text-muted"}`}>
              {line.mark && <LineMark mark={line.mark} />}
              <span className="overflow-hidden">{line.text}</span>
            </div>
          );
        })}
        <div className="fade-down absolute inset-x-0 top-0 h-50 transition-transform group-hover:translate-y-9.5 group-focus-visible:translate-y-9.5" />
        <div className="fade-right absolute inset-y-0 right-0 w-12" />
      </div>

      <div className="label mt-auto flex flex-col gap-1 pt-6 text-muted">
        <span>
          {card.author} · {card.handle}
        </span>
        <span>{card.tools.join(" · ")}</span>
      </div>
    </Link>
  );
}
