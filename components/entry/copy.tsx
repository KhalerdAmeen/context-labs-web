"use client";

import { useEffect, useRef, useState } from "react";

/** Copy text to the clipboard; `copied` stays true for 2s (design: every copy shows "copied" for 2s). */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard blocked (permissions / insecure origin): nothing to fall back to without a prompt
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

/** The rail's text buttons: "copy file", "copy context template". */
export function CopyButton({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={`flex h-12 cursor-pointer items-center justify-center px-5 text-15 font-medium whitespace-nowrap ${
        primary ? "bg-accent text-bg" : "border border-text"
      }`}
    >
      <span aria-live="polite">{copied ? "copied" : label}</span>
    </button>
  );
}

/** "download .md": a client-side file save. No email, no server. */
export function DownloadTextButton({ text, filename, label }: { text: string; filename: string; label: string }) {
  const save = () => {
    const url = URL.createObjectURL(new Blob([text + "\n"], { type: "text/markdown" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" onClick={save} className="flex h-12 cursor-pointer items-center justify-center border border-text px-5 text-15 font-medium whitespace-nowrap">
      {label}
    </button>
  );
}
