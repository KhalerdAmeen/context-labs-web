"use client";

import { useState } from "react";
import { Mark } from "../icons";

// design/WaitlistHome.dc.html: email + "get early access", then "you're in." in place of the form.

type State = { kind: "idle" | "sending" | "done" } | { kind: "error"; message: string };
const FALLBACK = "something went wrong. try again in a minute.";

export function WaitlistForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), company: data.get("company") }),
      });
      if (res.ok) return setState({ kind: "done" });
      const body = await res.json().catch(() => null);
      setState({ kind: "error", message: body?.error ?? FALLBACK });
    } catch {
      setState({ kind: "error", message: FALLBACK });
    }
  }

  if (state.kind === "done") {
    return (
      <p role="status" className="mt-7 flex min-h-12 items-center gap-3 font-mono text-14 leading-body">
        <Mark />
        <span>you&apos;re in. first drawers open soon.</span>
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-7 max-w-130">
      <div className="flex flex-col gap-2 t:flex-row t:gap-0">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          aria-label="email"
          aria-invalid={state.kind === "error" || undefined}
          aria-describedby={state.kind === "error" ? "waitlist-error" : undefined}
          className="h-12 min-w-0 flex-1 border border-edge bg-bg px-4 text-15 outline-none t:border-r-transparent"
        />
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="h-12 flex-none cursor-pointer bg-accent px-6 text-15 font-medium text-bg disabled:cursor-wait"
        >
          {state.kind === "sending" ? "joining…" : "get early access"}
        </button>
      </div>
      {/* honeypot: hidden from people and assistive tech; bots fill it */}
      <div aria-hidden="true" className="sr-only">
        <label>
          company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.kind === "error" && (
        <p id="waitlist-error" role="alert" className="mt-3 border-l-2 border-text py-0.5 pl-3.5 text-14 leading-body">
          {state.message}
        </p>
      )}
    </form>
  );
}
