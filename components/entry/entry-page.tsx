import Link from "next/link";
import { getEntryBySlug, type Entry } from "@/lib/content";
import { toCard } from "@/lib/content/card";
import { monthYear } from "@/lib/format";
import { site } from "@/lib/site";
import { TypeBadge } from "../badge";
import { Card, cellArrow } from "../card";
import { ArrowUpRight } from "../icons";
import { CodePanel } from "./code-panel";
import { CopyButton, DownloadTextButton } from "./copy";
import { DownloadZipButton } from "./download";
import { Inside } from "./inside";
import { InstallTabs } from "./install-tabs";
import { QuestionCard } from "./question-card";
import { RichText } from "./rich-text";
import { RulesApplied } from "./rules-applied";
import { Section, Source } from "./section";

// design/EntryPage.dc.html. One component for kit, skill and context pages: a header, then a
// 2fr / 1fr split (main + sticky rail) on desktop; on tablet and mobile the rail comes first.
// Section numbers follow whichever sections the entry has.

const CRUMB = { kit: ["kits", "kit"], skill: ["skills", "skill"], context: ["context", "context"] } as const;
const FACT_COLS: Record<number, string> = { 1: "t:grid-cols-1", 2: "t:grid-cols-2", 3: "t:grid-cols-3", 4: "t:grid-cols-4" };
const PANEL_COLS: Record<number, string> = { 1: "d:grid-cols-1", 2: "d:grid-cols-2", 3: "d:grid-cols-3" };
const pad = "px-5 t:px-6";

function Header({ e }: { e: Entry }) {
  const [crumb, typeParam] = CRUMB[e.type];
  const kit = e.type === "skill" && e.kit ? getEntryBySlug(e.kit) : undefined;
  return (
    <header className={`border-b border-hairline pt-6 pb-10 t:pt-8 d:pb-12 ${pad}`}>
      <nav aria-label="breadcrumb" className="label flex min-h-11 flex-wrap items-center gap-x-2.5 text-muted">
        <Link href="/" className="flex h-11 items-center hover:text-text">
          browse
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/?type=${typeParam}`} className="flex h-11 items-center hover:text-text">
          {crumb}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-text">
          {e.title.toLowerCase()}
        </span>
      </nav>
      <div className="mt-5 flex h-6 items-center">
        <TypeBadge type={e.type} />
      </div>
      <h1 className="mt-6 text-36 leading-display font-medium tracking-display t:text-44 d:text-56">{e.title}</h1>
      <p className="mt-4 max-w-60ch text-15 leading-body text-pretty">{e.intro}</p>
      <p className="label mt-5 leading-meta text-muted">
        {e.author} · {e.handle} · updated {monthYear(e.updated)} · {site.licence}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="label mr-1.5 text-muted">works with</span>
        {e.works.map((w) => (
          <span key={w} className="label inline-flex h-9 items-center border border-edge px-3.5">
            {w}
          </span>
        ))}
      </div>
      {kit && (
        <Link href={kit.href} className="label mt-3 inline-flex h-11 items-center gap-2 text-muted transition-colors hover:text-text">
          part of the {kit.title.toLowerCase()} <ArrowUpRight size={9} strokeWidth={1.8} />
        </Link>
      )}
    </header>
  );
}

function PrimaryAction({ e, className = "" }: { e: Entry; className?: string }) {
  if (e.type === "context") return <CopyButton text={e.fileText!} label="copy file" primary />;
  return e.download ? <DownloadZipButton slug={e.slug} className={className} /> : null;
}

function SecondaryAction({ e }: { e: Entry }) {
  if (e.type === "context") return <DownloadTextButton text={e.fileText!} filename={e.file} label="download .md" />;
  if (e.type === "kit" && e.templateText) return <CopyButton text={e.templateText} label="copy context template" />;
  return null;
}

function Rail({ e }: { e: Entry }) {
  const secondary = <SecondaryAction e={e} />;
  const hasSecondary = (e.type === "context" && !!e.fileText) || (e.type === "kit" && !!e.templateText);
  return (
    <aside className="relative order-0 grid grid-cols-1 border-b border-hairline t:grid-cols-2 d:sticky d:top-16 d:order-2 d:grid-cols-1 d:border-b-0">
      <div className={`${hasSecondary ? "flex" : "hidden t:flex"} flex-col gap-3 p-5 t:flex-row t:border-r t:border-hairline t:p-6 d:flex-col d:border-r-0`}>
        {/* on mobile the primary action lives in the sticky bar at the bottom */}
        <div className="hidden t:contents">
          <PrimaryAction e={e} />
        </div>
        {secondary}
      </div>
      <div className="order-3 border-t border-hairline p-5 t:order-1 t:border-t-0 t:p-6 d:order-3 d:border-t">
        <p className="label text-muted">try it</p>
        <p className="mt-3 bg-surface px-4 py-3.5 font-mono text-14 leading-prompt">› {e.tryIt}</p>
      </div>
      {e.facts.length > 0 && (
        <dl className={`order-2 col-span-full -mr-px grid grid-cols-1 ${FACT_COLS[e.facts.length] ?? "t:grid-cols-4"} d:grid-cols-1`}>
          {e.facts.map((f) => (
            <div key={f.k} className="flex justify-between gap-x-4 gap-y-1.5 border-t border-r border-hairline px-5 py-3.5 t:flex-col t:px-6 d:flex-row">
              <dt className="label flex-none leading-code text-muted">{f.k}</dt>
              <dd className="text-right font-mono text-13 leading-code t:text-left d:text-right">{f.v}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}

export function EntryPage({ e }: { e: Entry }) {
  let n = 0;
  const num = () => String(++n).padStart(2, "0");
  const related = e.related.map((s) => getEntryBySlug(s)).filter((r): r is Entry => !!r);

  return (
    <div className="mx-auto max-w-page border-x border-transparent wide:border-hairline">
      <Header e={e} />

      <div className="grid grid-cols-1 items-start d:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Rail e={e} />

        <div className="order-1 min-w-0 d:border-r d:border-hairline">
          {e.type === "kit" && (
            <>
              {e.how.length > 0 && (
                <Section id="how" n={num()} title="how it works">
                  <div className="-mr-px -mb-px grid grid-cols-1 border-t border-hairline t:grid-cols-2 d:grid-cols-4">
                    {e.how.map((h, i) => (
                      <div key={h.t} className="flex flex-col border-r border-b border-hairline p-5 t:p-6 d:min-h-60">
                        <span className="font-mono text-12 tracking-label text-muted">{String(i + 1).padStart(2, "0")}</span>
                        <span className="mt-5 text-20 font-medium tracking-heading t:mt-10">{h.t}</span>
                        <span className="mt-2 text-15 leading-body text-pretty text-muted">{h.d}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
              {e.see && (
                <Section id="see" n={num()} title="what you'll see">
                  <div className={`pb-10 d:pb-12 ${pad}`}>
                    <QuestionCard see={e.see} />
                    <p className="mt-4 text-15 leading-body text-muted">{e.see.note}</p>
                    <Source text={e.see.source} className="mt-3" />
                  </div>
                </Section>
              )}
              {e.get && (
                <Section id="get" n={num()} title="what you get">
                  <div className="-mr-px grid grid-cols-1 border-t border-hairline t:grid-cols-[minmax(0,2fr)_56px_minmax(0,5fr)]">
                    <div className="border-r border-b border-hairline p-5 t:p-6">
                      <p className="label text-muted">a one-line prompt</p>
                      <p className="mt-5 font-mono text-15 leading-prompt">› {e.get.prompt}</p>
                    </div>
                    <div aria-hidden="true" className="flex min-h-14 items-center justify-center border-r border-b border-hairline text-muted">
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="rotate-90 t:rotate-0">
                        <path d="M0 6h18M13 1l5 5-5 5" />
                      </svg>
                    </div>
                    <div className="min-w-0 border-r border-b border-hairline">
                      <CodePanel label={e.get.label} lines={e.get.lines} />
                    </div>
                  </div>
                  <Source text={e.get.source} className={`py-5 ${pad}`} />
                </Section>
              )}
            </>
          )}

          {e.type === "skill" && (
            <>
              {e.triggers.length > 0 && (
                <Section id="triggers" n={num()} title="triggers" tight>
                  <p className={`pb-7 text-15 leading-body text-muted ${pad}`}>it switches on when you say:</p>
                  <ul>
                    {e.triggers.map((t) => (
                      <li key={t} className={`border-t border-hairline py-4.5 font-mono text-15 leading-prompt ${pad}`}>
                        › {t}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
              {e.examples && (
                <Section id="examples" n={num()} title={e.examples.title}>
                  <div className={`-mr-px grid grid-cols-1 border-t border-hairline ${PANEL_COLS[e.examples.panels.length]}`}>
                    {e.examples.panels.map((p) => (
                      <div key={p.label} className="min-w-0 border-r border-b border-hairline">
                        <CodePanel label={p.label} lines={p.lines} wrap={p.wrap} />
                      </div>
                    ))}
                  </div>
                  <div className={`pt-5 pb-10 d:pb-12 ${pad}`}>
                    {e.examples.note && <p className="text-15 leading-body text-muted">{e.examples.note}</p>}
                    <Source text={e.examples.source} className="mt-3" />
                  </div>
                </Section>
              )}
            </>
          )}

          {e.type === "context" && (
            <Section id="rules" n={num()} title="rules, then applied">
              <RulesApplied file={e.file} rules={e.rules} fileText={e.fileText!} applied={e.applied} appliedLabel="applied · cram (test project)" />
              {e.applied.length > 0 && <Source text={e.source} className={`border-t border-hairline py-5 ${pad}`} />}
            </Section>
          )}

          {e.install.length > 0 && (
            <Section id="install" n={num()} title={e.type === "context" ? "where to put it" : "install"}>
              <InstallTabs tabs={e.install} />
            </Section>
          )}

          {e.type !== "context" && e.inside.length > 0 && (
            <Section id="inside" n={num()} title="what's inside">
              <Inside files={e.inside} />
            </Section>
          )}

          {e.type === "kit" && e.keep && (
            <Section id="keep" n={num()} title="keep it alive">
              <p className={`max-w-56ch pb-10 text-20 leading-prompt text-pretty d:pb-12 ${pad}`}>
                <RichText text={e.keep} size="lead" />
              </p>
            </Section>
          )}

          {e.type === "context" && e.generate && (
            <Section id="generate" n={num()} title="generate it instead">
              <Link href={e.generate.href} className="cell group relative block border-t border-hairline py-5 pr-18 pl-5 focus-visible:z-3 t:py-6 t:pl-6">
                <ArrowUpRight className={cellArrow} />
                <span className="block max-w-44ch text-20 leading-lead font-medium tracking-heading text-pretty">{e.generate.text}</span>
              </Link>
            </Section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <Section id="related" n={num()} title="related" last>
          <div className="-mr-px grid grid-cols-1 border-t border-hairline t:grid-cols-3">
            {related.map((r) => (
              <Card key={r.slug} card={toCard(r)} className="border-r border-b border-hairline" />
            ))}
          </div>
        </Section>
      )}

      {/* mobile: the primary action pinned to the bottom of the screen */}
      <div className="sticky bottom-0 z-30 border-t border-hairline bg-bg px-4 pt-1 pb-[calc(4px+env(safe-area-inset-bottom))] t:hidden">
        <div className="grid">
          <PrimaryAction e={e} className="w-full" />
        </div>
      </div>
    </div>
  );
}
