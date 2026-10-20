// design/EntryPage.dc.html section head: a mono number, then the title (28 / 24 / 22).

export function Section({
  id,
  n,
  title,
  tight = false,
  last = false,
  children,
}: {
  id: string;
  n: string;
  title: string;
  /** the triggers section sits closer to its intro line */
  tight?: boolean;
  /** related sits outside the split and has no bottom rule */
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-16 ${last ? "" : "border-b border-hairline"}`}>
      <div className={`flex items-baseline gap-4 px-5 pt-10 t:px-6 d:pt-12 ${tight ? "pb-3" : "pb-7"}`}>
        <span aria-hidden="true" className="font-mono text-12 text-muted">
          {n}
        </span>
        <h2 id={`${id}-title`} className="text-22 leading-heading font-medium tracking-heading t:text-24 d:text-28">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** "from a real run · …" under example content. */
export function Source({ text, className = "" }: { text?: string; className?: string }) {
  if (!text) return null;
  return <p className={`label leading-meta text-muted ${className}`}>{text}</p>;
}
