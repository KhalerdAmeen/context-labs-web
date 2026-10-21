import Link from "next/link";
import { ArrowUpRight, Mark } from "./icons";

// design/SystemStates.dc.html state "404": a 3×3 grid of empty drawers (one row on mobile) with the
// message in the middle one. Used by the 404 and by the expired / invalid download-link pages.

const CENTER = 4;
// mobile keeps only the middle row (cells 3–5)
const onMobile = (i: number) => (i >= 3 && i <= 5 ? "flex" : "hidden t:flex");

export function DrawerState({
  label,
  title,
  body,
  action,
}: {
  label: string;
  title: string;
  body?: string;
  /** a link styled as text (the 404) or as an outline button (link pages) */
  action: { href: string; text: string; button?: boolean };
}) {
  return (
    <div className="-mr-px grid grid-cols-1 t:grid-cols-3">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className={`${onMobile(i)} min-h-50 flex-col border-r border-b border-hairline p-5 t:min-h-60 t:p-6 ${i === CENTER ? "bg-surface" : ""}`}>
          {i === CENTER && (
            <>
              <p className="label flex h-6 items-center gap-3 text-muted">
                <Mark muted />
                <span>{label}</span>
              </p>
              <h1 className="mt-auto pt-6 text-22 font-medium tracking-heading t:text-28">{title}</h1>
              {body && <p className="mt-2 text-15 leading-body text-pretty text-muted">{body}</p>}
              {action.button ? (
                <Link href={action.href} className="mt-5 inline-flex h-12 items-center gap-2.5 self-start border border-text px-5 text-15 font-medium">
                  {action.text} <ArrowUpRight size={10} strokeWidth={1.8} />
                </Link>
              ) : (
                <Link href={action.href} className="mt-3 inline-flex h-11 items-center gap-2 self-start text-15 underline underline-offset-4">
                  {action.text} <ArrowUpRight size={10} strokeWidth={1.8} />
                </Link>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
