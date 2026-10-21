import { notFound } from "next/navigation";
import { getEntries, getEntry } from "@/lib/content";
import { entryImage, OG_SIZE } from "@/lib/og";

export const alt = "a context labs drawer: its type, title, description and a preview of the file";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getEntries()
    .filter((e) => e.type === "skill")
    .map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const e = getEntry("skill", (await params).slug);
  if (!e) notFound();
  return entryImage(e);
}
