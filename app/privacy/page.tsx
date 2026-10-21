import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

// Plain-English privacy note. Laid out like /submit's "what gets accepted" rows.

export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "privacy",
  description: "what context labs stores, why, and how to unsubscribe.",
};

const ROWS: [string, ReactNode][] = [
  ["what we store", "when you download a .zip: your email, which file you downloaded, and whether you ticked \"send me new kits\". if you join the waitlist: your email."],
  ["why", "to email you the private download link you asked for. we only send anything else if you opted in to new kits or joined the waitlist."],
  [
    "unsubscribe or delete",
    <>
      use the unsubscribe link in any email we send. to have your email deleted, DM{" "}
      <a href={site.xUrl} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-4">
        {site.handle}
      </a>{" "}
      on X.
    </>,
  ],
  ["who handles it", "Loops stores your email and sends our emails. Vercel hosts the site; its analytics don't use cookies or identify you. the submit form is run by Tally, under Tally's own privacy policy."],
  ["on your device", "after a download, your browser remembers your email so you aren't asked again. \"use a different email\" in the download pop-up forgets it."],
  ["what we don't do", "no cookies of our own, no ads, no selling or sharing your email."],
];

export default function Privacy() {
  return (
    <>
      <header className="border-b border-hairline px-5 pt-10 pb-10 t:px-6 t:pt-16 d:pb-12">
        <h1 className="text-36 leading-display font-medium tracking-display t:text-44 d:text-56">privacy</h1>
        <p className="mt-4 max-w-56ch text-15 leading-body text-pretty text-muted">what we keep and why. short on purpose.</p>
        <p className="label mt-5 text-muted">
          updated oct 2026 · {site.name}
        </p>
      </header>
      <ol className="max-w-180 d:border-r d:border-hairline">
        {ROWS.map(([k, v], i) => (
          <li key={k} className={`flex gap-5 px-5 py-5 t:px-6 ${i > 0 ? "border-t border-hairline" : ""}`}>
            <span aria-hidden="true" className="flex-none font-mono text-12 leading-5.5 text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-15 leading-5.5 font-medium">{k}</h2>
              <p className="max-w-60ch text-15 leading-body text-pretty text-muted">{v}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
