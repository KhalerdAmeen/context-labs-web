"use client";

import Script from "next/script";

// Tally's embed script turns iframes with data-tally-src into auto-height forms. It loads after the
// page is idle (lazyOnload) so it never competes with the page itself.
// Colours and fonts inside the form come from the form's own theme in Tally.

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

export function TallyEmbed({ formId }: { formId: string }) {
  const src = `https://tally.so/embed/${encodeURIComponent(formId)}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
  return (
    <>
      <iframe data-tally-src={src} loading="lazy" width="100%" height="560" title="submit your context" className="block w-full border-0" />
      <noscript>
        <a href={`https://tally.so/r/${encodeURIComponent(formId)}`} className="underline underline-offset-4">
          open the submission form
        </a>
      </noscript>
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" onLoad={() => window.Tally?.loadEmbeds()} />
    </>
  );
}
