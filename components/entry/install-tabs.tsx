"use client";

import { useId, useRef, useState } from "react";
import type { Frontmatter } from "@/lib/content/schema";
import { CopyIcon } from "./code-panel";
import { useCopy } from "./copy";
import { RichText } from "./rich-text";

// design/EntryPage.dc.html install section: mono tabs with a text-colour underline, numbered steps.
// A step can be a command (CONTEXT.md: the Claude Code tab is two commands, each with a copy button).

type Tab = Frontmatter["install"][number];

function Command({ command }: { command: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 bg-surface pl-4">
      <code className="min-w-0 py-3 font-mono text-14 leading-prompt [overflow-wrap:anywhere]">{command}</code>
      <button
        type="button"
        onClick={() => copy(command)}
        aria-label={copied ? "copied" : `copy: ${command}`}
        className="focus-inset flex h-11 min-w-11 flex-none cursor-pointer items-center justify-center px-3.5 text-muted transition-colors hover:text-text"
      >
        {copied ? <span className="label text-text">copied</span> : <CopyIcon />}
      </button>
    </div>
  );
}

export function InstallTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const tab = tabs[active];

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label="install for" onKeyDown={onKey} className="no-scrollbar flex overflow-x-auto border-t border-hairline px-1.5 whitespace-nowrap t:px-2.5">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${t.key}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`label focus-inset relative h-12 flex-none cursor-pointer px-3.5 transition-colors ${i === active ? "text-text" : "text-muted hover:text-text"}`}
          >
            {t.label}
            {i === active && <span className="absolute inset-x-3.5 bottom-0 h-0.5 bg-text" />}
          </button>
        ))}
      </div>
      <ol role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${tab.key}`}>
        {tab.steps.map((s, i) => (
          <li key={i} className="flex items-baseline gap-6 border-t border-hairline px-5 py-5 t:px-6">
            <span aria-hidden="true" className="flex-none font-mono text-13 text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1 text-15 leading-body">
              {typeof s === "string" ? <RichText text={s} /> : <Command command={s.command} />}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
