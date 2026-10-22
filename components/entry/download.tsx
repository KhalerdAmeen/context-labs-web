"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Close } from "../icons";

// "download .zip" → this pop-up → /api/download → Loops emails a private link (7 days).
// Built from the question-card pattern (design/EntryPage.dc.html "what you'll see"): surface panel,
// edge border, mono header bar, hairline-separated rows, actions bottom-right.
// Native <dialog>.showModal() makes the page inert; Tab is looped inside; Esc closes; focus returns to
// the button that opened it. The email is remembered so a returning visitor isn't asked twice.

const STORAGE_KEY = "context-labs:email";
const FALLBACK = "something went wrong. try again in a minute.";

type State =
  | { kind: "form"; error?: string; email?: string }
  | { kind: "sending"; email: string; remembered: boolean }
  | { kind: "sent"; email: string };

const Check = () => (
  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M1 4.8L3.8 7.6L9 1.2" />
  </svg>
);

function readRemembered() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked (private mode, policy): just ask every time
  }
}

export function DownloadZipButton({ slug, file, className = "" }: { slug: string; file: string; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<State>({ kind: "form" });
  const [optIn, setOptIn] = useState(false);
  const id = useId();

  async function send(email: string, opted: boolean, company: string, remembered: boolean) {
    setState({ kind: "sending", email, remembered });
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email, optIn: opted, company }),
      });
      if (res.ok) {
        try {
          localStorage.setItem(STORAGE_KEY, email);
        } catch {}
        return setState({ kind: "sent", email });
      }
      const body = await res.json().catch(() => null);
      setState({ kind: "form", email, error: body?.error ?? FALLBACK });
    } catch {
      setState({ kind: "form", email, error: FALLBACK });
    }
  }

  function open() {
    const remembered = readRemembered();
    setOptIn(false);
    dialog.current?.showModal();
    if (remembered) send(remembered, false, "", true);
    else setState({ kind: "form" });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    send(String(data.get("email") ?? "").trim(), optIn, String(data.get("company") ?? ""), false);
  }

  function useDifferentEmail() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({ kind: "form" });
  }

  // keep Tab inside the dialog (showModal makes the page inert, but Tab can still reach browser chrome)
  function loopTab(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab") return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>("button, a[href], input:not([tabindex='-1'])")].filter(
      (el) => !el.hasAttribute("disabled") && el.getClientRects().length > 0, // skip the copy that isn't displayed
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const sending = state.kind === "sending";

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className={`flex h-12 cursor-pointer items-center justify-center gap-2.5 bg-accent px-5 text-15 font-medium whitespace-nowrap text-bg ${className}`}
      >
        download .zip
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={descId}
        onKeyDown={loopTab}
        onClose={() => trigger.current?.focus()}
        className="m-auto w-[calc(100%-2rem)] max-w-140 border border-edge bg-surface text-text backdrop:bg-bg/80"
      >
        <div className="label flex h-12 items-center justify-between border-b border-hairline pl-5 text-muted">
          <span className="truncate">download · {file}</span>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="close"
            className="focus-inset flex size-12 flex-none cursor-pointer items-center justify-center text-text"
          >
            <Close />
          </button>
        </div>

        {state.kind === "sent" || (sending && state.remembered) ? (
          <div>
            <div className="px-5 pt-5 pb-6" aria-live="polite">
              <h2 id={titleId} className="text-17 leading-question font-medium">
                {sending ? "sending your link…" : "check your inbox."}
              </h2>
              <p id={descId} className="mt-2 text-15 leading-body text-muted">
                {sending ? (
                  <>to {state.email}</>
                ) : (
                  <>
                    a private link to <span className="font-mono text-14 text-text">{file}</span> is on its way to{" "}
                    <span className="text-text">{state.email}</span>. it works for 7 days.
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-5 py-3">
              <button type="button" onClick={useDifferentEmail} disabled={sending} className="h-11 cursor-pointer text-15 text-muted underline underline-offset-4 disabled:cursor-wait">
                use a different email
              </button>
              <button type="button" onClick={() => dialog.current?.close()} className="h-12 cursor-pointer border border-text px-5 text-15 font-medium">
                done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="px-5 pt-5">
              <h2 id={titleId} className="text-17 leading-question font-medium">
                where should we send it?
              </h2>
              <p id={descId} className="mt-2 text-15 leading-body text-muted">
                we email you a private download link. it works for 7 days.
              </p>
              <input
                key={state.kind === "form" ? (state.email ?? "") : "sending"}
                type="email"
                name="email"
                required
                autoFocus
                autoComplete="email"
                defaultValue={state.email}
                placeholder="you@email.com"
                aria-label="email"
                aria-invalid={state.kind === "form" && !!state.error ? true : undefined}
                aria-describedby={state.kind === "form" && state.error ? `${id}-error` : undefined}
                className="mt-4 h-12 w-full border border-edge bg-bg px-4 text-16 outline-none t:text-15"
              />
              {state.kind === "form" && state.error && (
                <p id={`${id}-error`} role="alert" className="mt-3 border-l-2 border-text py-0.5 pl-3.5 text-14 leading-body">
                  {state.error}
                </p>
              )}
            </div>
            <button
              type="button"
              role="checkbox"
              aria-checked={optIn}
              onClick={() => setOptIn((v) => !v)}
              className="focus-inset mt-5 flex min-h-12 w-full cursor-pointer items-center gap-3.5 border-t border-hairline px-5 py-2.5 text-left text-14"
            >
              <span className={`flex size-4 flex-none items-center justify-center border text-bg ${optIn ? "border-text bg-text" : "border-muted"}`}>{optIn && <Check />}</span>
              <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                <span>send me new kits</span>
                <span className="text-muted">— optional, unsubscribe any time</span>
              </span>
            </button>
            {/* honeypot: hidden from people and assistive tech; bots fill it */}
            <div aria-hidden="true" className="sr-only">
              <label>
                company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            {/* mobile: the send button full width under the field; from t: up it sits bottom-right.
                Two copies, one displayed, so focus order always matches what you see. */}
            <div className="border-t border-hairline px-5 py-3">
              <button type="submit" disabled={sending} className="mb-1 h-12 w-full cursor-pointer bg-accent px-5 text-15 font-medium text-bg disabled:cursor-wait t:hidden">
                {sending ? "sending…" : "send the link"}
              </button>
              <div className="flex items-center justify-between gap-2">
                <Link href="/privacy" className="flex h-11 items-center text-14 text-muted underline underline-offset-4 hover:text-text">
                  how we use your email
                </Link>
                <div className="flex gap-2">
                  <button type="button" onClick={() => dialog.current?.close()} className="h-12 cursor-pointer px-4 text-15 text-muted">
                    cancel
                  </button>
                  <button type="submit" disabled={sending} className="hidden h-12 cursor-pointer bg-accent px-5 text-15 font-medium text-bg disabled:cursor-wait t:block">
                    {sending ? "sending…" : "send the link"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
        {/* the dialog sits in the top layer, above the page grain, so it carries its own */}
        <div aria-hidden="true" className="grain pointer-events-none fixed inset-0" />
      </dialog>
    </>
  );
}
