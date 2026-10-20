import { codeParts } from "@/lib/format";

/** Prose with `code` spans rendered as mono chips (design: Geist Mono 14 on surface, 2px 6px). */
export function RichText({ text, size = "body" }: { text: string; size?: "body" | "lead" }) {
  return (
    <>
      {codeParts(text).map((p, i) =>
        p.code ? (
          <code
            key={i}
            className={`bg-surface font-mono ${size === "lead" ? "px-2 py-0.5 text-17" : "px-1.5 py-0.5 text-14"} [box-decoration-break:clone]`}
          >
            {p.t}
          </code>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </>
  );
}
