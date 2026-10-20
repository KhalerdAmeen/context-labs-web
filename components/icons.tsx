// Icons drawn from design/*.dc.html. All inherit currentColor.

export function ArrowUpRight({ size = 14, strokeWidth = 1.5, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <path d="M1 13L13 1M3.5 1H13V10.5" />
    </svg>
  );
}

export function Burger() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 7h14M3 13h14" />
    </svg>
  );
}

export function Close() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

/** ✕ / ✓ glyphs used in code previews (fail / pass). */
export function LineMark({ mark, className }: { mark: "x" | "ok"; className?: string }) {
  return mark === "x" ? (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.4" className={`flex-none ${className ?? ""}`} aria-label="fail" role="img">
      <path d="M1 1l7 7M8 1L1 8" />
    </svg>
  ) : (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" stroke="currentColor" strokeWidth="1.4" className={`flex-none ${className ?? ""}`} aria-label="pass" role="img">
      <path d="M1 4.8L3.8 7.6L9 1.2" />
    </svg>
  );
}

/** The logo mark: a 10px outlined square with a 4px centre dot. */
export function Mark({ muted = false }: { muted?: boolean }) {
  return (
    <span className={`flex size-2.5 items-center justify-center border ${muted ? "border-muted" : "border-text"}`} aria-hidden="true">
      {!muted && <span className="size-1 bg-text" />}
    </span>
  );
}
