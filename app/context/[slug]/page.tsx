import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/entry/entry-page";
import { getEntries, getEntry } from "@/lib/content";

// Fully static. Cache Components has no dynamicParams, so an unknown or draft slug renders once on
// request, hits notFound() and gets the "drawer not found" page.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return getEntries()
    .filter((e) => e.type === "context")
    .map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/context/[slug]">): Promise<Metadata> {
  const e = getEntry("context", (await params).slug);
  return e ? { title: e.title, description: e.desc } : {};
}

export default async function Page({ params }: PageProps<"/context/[slug]">) {
  const e = getEntry("context", (await params).slug);
  if (!e) notFound();
  return <EntryPage e={e} />;
}
