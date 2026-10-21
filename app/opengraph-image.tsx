import { countLabel, toCard } from "@/lib/content/card";
import { getEntries } from "@/lib/content";
import { homeImage, OG_SIZE } from "@/lib/og";
import { waitlistMode } from "@/lib/site";

export const alt = "context labs — the context behind good ai work.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const cards = getEntries().map(toCard);
  const n = cards.length;
  return homeImage(waitlistMode ? `opening with ${n} ${n === 1 ? "entry" : "entries"} · free · cc by` : `${countLabel(cards)} · free · cc by`);
}
