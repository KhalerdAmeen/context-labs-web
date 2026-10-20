import type { Entry } from "./index";

/** The slice of an entry a drawer card needs. Plain data, so it can cross into client components. */
export type CardData = Pick<Entry, "slug" | "href" | "type" | "title" | "desc" | "tools" | "preview" | "author" | "handle">;

export function toCard(e: Entry): CardData {
  const { slug, href, type, title, desc, tools, preview, author, handle } = e;
  return { slug, href, type, title, desc, tools, preview, author, handle };
}

/** "4 entries · 1 kit" */
export function countLabel(cards: Pick<CardData, "type">[]) {
  const kits = cards.filter((c) => c.type === "kit").length;
  return `${cards.length} ${cards.length === 1 ? "entry" : "entries"} · ${kits} ${kits === 1 ? "kit" : "kits"}`;
}
