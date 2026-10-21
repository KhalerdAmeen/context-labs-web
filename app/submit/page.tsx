import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { TallyEmbed } from "@/components/submit/tally-embed";
import { tallyFormId } from "@/lib/site";

// design/SubmitPage.dc.html, with the hand-built form replaced by the Tally embed (CONTEXT.md).
// Until NEXT_PUBLIC_TALLY_FORM_ID is set the form area says "submissions open soon" — the footer
// reads the same variable.

export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "submit",
  description: "files that carried a real project. we test every one before it goes live.",
};

const RULES = [
  ["tested", "works in at least one named tool"],
  ["shows its output", "a before/after or example"],
  ["clean", "no keys, passwords or client data"],
  ["credited", "yours or the source named"],
  ["specific", 'real decisions, not "make it look good"'],
];

export default function Submit() {
  return (
    <>
      <header className="border-b border-hairline px-5 pt-10 pb-10 t:px-6 t:pt-16 d:pb-12">
        <h1 className="text-36 leading-display font-medium tracking-display t:text-44 d:text-56">submit your context</h1>
        <p className="mt-4 max-w-56ch text-15 leading-body text-pretty text-muted">files that carried a real project. we test every one before it goes live.</p>
      </header>

      <div className="grid grid-cols-1 items-start d:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-hairline px-5 pt-10 pb-12 t:px-6 d:border-r d:border-b-0 d:pt-12 d:pb-18">
          {tallyFormId ? (
            <div className="max-w-160">
              <TallyEmbed formId={tallyFormId} />
            </div>
          ) : (
            <div className="max-w-160 py-6 t:py-16">
              <p className="text-44 leading-display font-medium tracking-display t:text-64 d:text-72">submissions open soon.</p>
              <p className="mt-5 max-w-52ch text-15 leading-body text-pretty">
                the form goes live shortly. until then, the list on the right is what every submission gets tested against.
              </p>
              <Link href="/" className="mt-8 inline-flex h-12 items-center gap-2.5 border border-text px-5 text-15 font-medium">
                browse the library <ArrowUpRight size={10} strokeWidth={1.8} />
              </Link>
            </div>
          )}
        </div>

        <aside aria-labelledby="accepted" className="relative d:sticky d:top-16">
          <h2 id="accepted" className="label px-5 pt-10 pb-5 text-muted t:px-6 d:pt-12">
            what gets accepted
          </h2>
          <ol>
            {RULES.map(([k, v], i) => (
              <li key={k} className="flex gap-5 border-t border-hairline px-5 py-4.5 t:px-6">
                <span className="flex-none font-mono text-12 leading-5.5 text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-15 leading-5.5 font-medium">{k}</span>
                  <span className="text-15 leading-body text-muted">{v}</span>
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
}
