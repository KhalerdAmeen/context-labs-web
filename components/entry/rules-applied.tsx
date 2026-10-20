"use client";

import { useState } from "react";
import { CodePanel } from "./code-panel";

// design/EntryPage.dc.html context section "rules, then applied": a two-state switch over one panel.

export function RulesApplied({
  file,
  rules,
  fileText,
  applied,
  appliedLabel,
}: {
  file: string;
  rules: string[];
  fileText: string;
  applied: string[];
  appliedLabel: string;
}) {
  const [showApplied, setShowApplied] = useState(false);
  const modes: [string, boolean][] = applied.length ? [["rules", false], ["applied", true]] : [];

  return (
    <>
      {modes.length > 0 && (
        <div className="px-5 pb-6 t:px-6">
          <div role="group" aria-label="view" className="inline-flex border border-edge">
            {modes.map(([label, val]) => {
              const on = showApplied === val;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setShowApplied(val)}
                  className={`label h-11 cursor-pointer px-4.5 ${on ? "bg-text text-bg" : "text-muted hover:text-text"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="border-t border-hairline">
        {showApplied ? (
          <CodePanel key="applied" label={appliedLabel} lines={applied} wrap />
        ) : (
          <CodePanel key="rules" label={file} lines={rules.length ? rules : fileText.split("\n")} copyText={fileText} wrap />
        )}
      </div>
    </>
  );
}
