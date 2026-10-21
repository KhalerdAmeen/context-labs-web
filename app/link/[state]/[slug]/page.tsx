import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DrawerState } from "@/components/drawer-state";
import { getEntries, getEntryBySlug } from "@/lib/content";
import { isLinkState, LINK_STATES, linkCopy } from "@/lib/link-states";

// /link/expired/setup, /link/invalid/context-labs … — /api/file redirects here when a download link
// fails, with a button back to the entry the link was for.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  const slugs = getEntries().filter((e) => e.download).map((e) => e.slug);
  return LINK_STATES.flatMap((state) => slugs.map((slug) => ({ state, slug })));
}

export async function generateMetadata({ params }: PageProps<"/link/[state]/[slug]">): Promise<Metadata> {
  const { state } = await params;
  return isLinkState(state) ? { title: linkCopy(state).title, robots: { index: false } } : {};
}

export default async function Page({ params }: PageProps<"/link/[state]/[slug]">) {
  const { state, slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!isLinkState(state) || !entry?.download) notFound();
  const copy = linkCopy(state, entry.title);
  return <DrawerState {...copy} action={{ href: entry.href, text: `back to ${entry.title}`, button: true }} />;
}
