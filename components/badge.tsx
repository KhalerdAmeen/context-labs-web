import type { EntryType } from "@/lib/content";

// design/CLCard.dc.html type tags: context = outline, skill = filled, kit = filled + offset outline.
const base = "label inline-flex h-6 items-center px-3.5";

export function TypeBadge({ type }: { type: EntryType }) {
  if (type === "context") return <span className={`${base} border border-text`}>context</span>;
  if (type === "skill") return <span className={`${base} bg-text font-medium text-bg`}>skill</span>;
  return <span className={`${base} ml-0.75 bg-text font-medium text-bg outline outline-offset-2 outline-text`}>kit</span>;
}
