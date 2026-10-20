"use client";

import { useState } from "react";
import type { Frontmatter } from "@/lib/content/schema";

// design/EntryPage.dc.html "what you'll see": the pop-up Claude shows, live. Single questions are
// square radios (options in mono, like found values); multi questions are checkboxes.

type See = NonNullable<Extract<Frontmatter, { type: "kit" }>["see"]>;

const Check = () => (
  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M1 4.8L3.8 7.6L9 1.2" />
  </svg>
);

export function QuestionCard({ see }: { see: See }) {
  const [answers, setAnswers] = useState(() => see.questions.map((q) => q.options.map((o) => o.on)));
  const pick = (qi: number, oi: number, multi: boolean) =>
    setAnswers((all) => all.map((opts, i) => (i !== qi ? opts : opts.map((on, j) => (multi ? (j === oi ? !on : on) : j === oi)))));

  return (
    <div className="max-w-140 border border-edge bg-surface">
      <div className="label flex h-12 items-center justify-between border-b border-hairline px-5 text-muted">
        <span>{see.header}</span>
        <span>1 / {see.questions.length}</span>
      </div>
      {see.questions.map((q, qi) => (
        <fieldset key={qi} role={q.multi ? "group" : "radiogroup"} className={qi > 0 ? "border-t border-edge" : ""}>
          <legend className="float-left w-full px-5 pt-5 pb-4 text-17 leading-question font-medium">{q.q}</legend>
          {q.options.map((o, oi) => {
            const on = answers[qi][oi];
            return (
              <button
                key={oi}
                type="button"
                role={q.multi ? "checkbox" : "radio"}
                aria-checked={on}
                onClick={() => pick(qi, oi, q.multi)}
                className="focus-inset flex min-h-12 w-full cursor-pointer items-center gap-3.5 border-t border-hairline px-5 py-2.5 text-left text-14"
              >
                {q.multi ? (
                  <span className={`flex size-4 flex-none items-center justify-center border text-bg ${on ? "border-text bg-text" : "border-muted"}`}>{on && <Check />}</span>
                ) : (
                  <span className={`flex size-4 flex-none items-center justify-center border ${on ? "border-text" : "border-muted"}`}>
                    <span className={`size-2 ${on ? "bg-text" : ""}`} />
                  </span>
                )}
                {o.swatch && <span className="size-3.5 flex-none" style={{ backgroundColor: o.swatch }} />}
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={q.multi ? "" : "font-mono text-13"}>{o.a}</span>
                  {o.b && <span className="text-muted">{o.b}</span>}
                </span>
              </button>
            );
          })}
        </fieldset>
      ))}
      <div className="flex justify-end gap-2 border-t border-hairline px-5 py-3">
        <button type="button" className="h-12 cursor-pointer px-4 text-15 text-muted">
          skip
        </button>
        <button type="button" className="h-12 cursor-pointer border border-text px-5 text-15 font-medium">
          submit answers
        </button>
      </div>
    </div>
  );
}
