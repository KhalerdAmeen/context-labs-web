import type { Metadata } from "next";
import Link from "next/link";
import { Loop } from "@/components/about/loop";
import { Section } from "@/components/entry/section";
import { ArrowUpRight } from "@/components/icons";

// design/AboutPage.dc.html. The "context" example uses the Cram test project's accent rule instead of
// the export's #C41E3A sample (CONTEXT.md: no export sample data on real pages).

export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "about",
  description: "every output is a prompt, context and a skill. most people only send the prompt. context labs is the other two, ready to take.",
};

const INPUTS = [
  { k: "prompt", q: "what do you want right now?", lasts: "lasts one message", ex: "› design the home feed" },
  { k: "context", q: "what's true here?", lasts: "lasts one project", ex: "one accent (#FFC400), the next block only" },
  { k: "skill", q: "how is this done?", lasts: "lasts forever", ex: "audit → layers → passes → checklist" },
];

const LEVELS = [
  { k: "personal", file: "about-me.md", when: "set once", where: "lives in your claude app profile or ~/.claude/CLAUDE.md. every chat reads it." },
  { k: "project", file: "CONTEXT.md", when: "every decision", where: "lives in the repo root, loaded through CLAUDE.md or project knowledge." },
  { k: "task", file: "the screenshot, the error", when: "every prompt", where: "lives in the message you send, then it's gone." },
];
const LEVEL_BG = ["", "bg-surface-nested", "bg-surface"];

function Level({ i }: { i: number }) {
  const l = LEVELS[i];
  return (
    <div className={`border border-edge-strong p-4 t:p-6 ${LEVEL_BG[i]}`}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
        <span className="label">{l.k}</span>
        <span className="font-mono text-15">{l.file}</span>
        <span className="label text-muted">{l.when}</span>
      </div>
      <p className="mt-2 text-15 leading-body text-muted">{l.where}</p>
      {i < LEVELS.length - 1 && (
        <div className="mt-4 t:mt-6">
          <Level i={i + 1} />
        </div>
      )}
    </div>
  );
}

export default function About() {
  return (
    <>
      <section className="border-b border-hairline px-5 pt-14 pb-12 t:px-6 t:pt-22 t:pb-18 d:pt-30 d:pb-24">
        <h1 className="max-w-14ch text-44 leading-display font-medium tracking-display text-balance t:text-64 d:text-72">
          ai didn&apos;t make it generic. the brief did.
        </h1>
        <p className="mt-7 max-w-56ch text-15 leading-body text-pretty">
          every output is a prompt, context and a skill. most people only send the prompt. context labs is the other two, ready to take.
        </p>
      </section>

      <Section id="inputs" n="01" title="the three inputs">
        <div className="-mr-px grid grid-cols-1 border-t border-hairline t:grid-cols-3">
          {INPUTS.map((c) => (
            <div key={c.k} className="flex flex-col border-r border-b border-hairline p-5 t:p-6">
              <span className="label">{c.k}</span>
              <span className="mt-8 text-20 leading-snug font-medium tracking-heading">{c.q}</span>
              <span className="label mt-2 text-muted">{c.lasts}</span>
              <span className="mt-8 bg-surface px-4 py-3.5 font-mono text-13 leading-prompt">{c.ex}</span>
            </div>
          ))}
        </div>
        <p className="px-5 py-5 font-mono text-13 leading-body t:px-6">prompt × context × skill. any of them at zero → generic.</p>
      </Section>

      <Section id="levels" n="02" title="three levels">
        <div className="max-w-240 px-5 pb-10 t:px-6 d:pb-12">
          <Level i={0} />
        </div>
      </Section>

      <Section id="loop" n="03" title="the loop">
        <div className="px-5 t:px-6">
          <Loop />
        </div>
        <p className="max-w-56ch px-5 pt-7 pb-10 text-15 leading-body text-muted t:px-6 d:pb-12">
          one file moves through every tool. each tool gets a prompt shaped for it.
        </p>
      </Section>

      <Section id="who" n="04" title="who makes this">
        <div className="flex flex-col items-start gap-8 px-5 pb-10 t:px-6 d:pb-12">
          <p className="max-w-52ch text-20 leading-prompt text-pretty">
            context labs is made by khalid — designer and builder behind routn and khadstudio. every entry is tested on a real project before it goes up.
          </p>
          <Link href="/submit" className="inline-flex h-12 items-center gap-2.5 bg-accent px-6 text-15 font-medium text-bg">
            submit yours <ArrowUpRight size={10} strokeWidth={1.8} />
          </Link>
        </div>
      </Section>
    </>
  );
}
