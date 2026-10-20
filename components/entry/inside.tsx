"use client";

import { useState } from "react";
import type { EntryFile } from "@/lib/content";
import { CodePanel } from "./code-panel";

// design/EntryPage.dc.html "what's inside": a file tree beside the viewer (t, d); on mobile a
// dropdown above it. Top-level files first, then one group per folder ("references/", or
// "setup/" and "setup/references/" on a kit), each file labelled by its name only so rows
// stay one line in the 220–248px column.

type Item = { kind: "group"; label: string } | { kind: "file"; index: number; label: string; nested: boolean };

const dirOf = (p: string) => (p.includes("/") ? p.slice(0, p.lastIndexOf("/") + 1) : "");

function treeOf(files: EntryFile[]): Item[] {
  const items: Item[] = [];
  files.forEach((f, index) => {
    if (!dirOf(f.path)) items.push({ kind: "file", index, label: f.path, nested: false });
  });
  const dirs = [...new Set(files.map((f) => dirOf(f.path)).filter(Boolean))]; // first-seen order: the kit's skill order
  for (const d of dirs) {
    items.push({ kind: "group", label: d });
    files.forEach((f, index) => {
      if (dirOf(f.path) === d) items.push({ kind: "file", index, label: f.path.slice(d.length), nested: true });
    });
  }
  return items;
}

export function Inside({ files }: { files: EntryFile[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const file = files[active];
  const fileClass = (i: number) =>
    `focus-inset flex h-11 w-full cursor-pointer items-center text-left font-mono text-13 ${i === active ? "bg-surface text-text" : "text-muted hover:text-text"}`;

  return (
    <div className="-mr-px -mb-px grid grid-cols-1 border-t border-hairline t:grid-cols-[220px_minmax(0,1fr)] d:grid-cols-[248px_minmax(0,1fr)]">
      <nav aria-label="files" className="hidden border-r border-b border-hairline py-2 t:block">
        {treeOf(files).map((it, k) =>
          it.kind === "group" ? (
            <div key={k} className="label flex h-10 items-end px-6 pb-1.5 text-muted">
              {it.label}
            </div>
          ) : (
            <button
              key={k}
              type="button"
              onClick={() => setActive(it.index)}
              aria-current={it.index === active ? "true" : undefined}
              className={`${fileClass(it.index)} pr-3.5 ${it.nested ? "pl-10" : "pl-6"}`}
            >
              {it.label}
            </button>
          ),
        )}
      </nav>

      <div className="min-w-0 border-r border-b border-hairline">
        <div className="t:hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="inside-files"
            className="focus-inset flex h-13 w-full cursor-pointer items-center justify-between gap-3 border-b border-hairline px-5 font-mono text-13"
          >
            <span className="truncate">{file.path}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={open ? "rotate-180" : ""}>
              <path d="M1 1.5l5 5 5-5" />
            </svg>
          </button>
          {open && (
            <div id="inside-files" className="border-b border-hairline py-1">
              {files.map((f, i) => (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setOpen(false);
                  }}
                  className={`${fileClass(i)} px-5`}
                >
                  {f.path}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* key: a new file starts collapsed again */}
        <CodePanel key={file.path} label={file.path} lines={file.text.split("\n")} copyText={file.text} collapsed={14} />
      </div>
    </div>
  );
}
