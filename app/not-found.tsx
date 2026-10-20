import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mark } from "@/components/icons";

// design/SystemStates.dc.html state "404": a 3×3 grid of empty drawers (one row on mobile) with the
// missing one in the middle.

export const metadata: Metadata = { title: "drawer not found" };

const CENTER = 4;
// mobile keeps only the middle row (cells 3–5)
const onMobile = (i: number) => (i >= 3 && i <= 5 ? "flex" : "hidden t:flex");

export default function NotFound() {
  return (
    <div className="-mr-px grid grid-cols-1 t:grid-cols-3">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className={`${onMobile(i)} min-h-50 flex-col border-r border-b border-hairline p-5 t:min-h-60 t:p-6 ${i === CENTER ? "bg-surface" : ""}`}>
          {i === CENTER && (
            <>
              <p className="label flex h-6 items-center gap-3 text-muted">
                <Mark muted />
                <span>drawer 404</span>
              </p>
              <h1 className="mt-auto text-22 font-medium tracking-heading t:text-28">drawer not found</h1>
              <Link href="/" className="mt-3 inline-flex h-11 items-center gap-2 self-start text-15 underline underline-offset-4">
                back to the library <ArrowUpRight size={10} strokeWidth={1.8} />
              </Link>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
