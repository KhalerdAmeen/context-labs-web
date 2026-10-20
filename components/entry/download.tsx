"use client";

// "download .zip" → email pop-up → Loops sends a private 7-day link. The dialog lands in Phase 5;
// until then this is the button only.

export function DownloadZipButton({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <button
      type="button"
      data-slug={slug}
      className={`flex h-12 cursor-pointer items-center justify-center gap-2.5 bg-accent px-5 text-15 font-medium whitespace-nowrap text-bg ${className}`}
    >
      download .zip
    </button>
  );
}
