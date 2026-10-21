import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DrawerState } from "@/components/drawer-state";
import { isLinkState, LINK_STATES, linkCopy } from "@/lib/link-states";

// /link/invalid — a download link we can't tie to any entry (mangled or for a file that's gone).
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return LINK_STATES.map((state) => ({ state }));
}

export async function generateMetadata({ params }: PageProps<"/link/[state]">): Promise<Metadata> {
  const { state } = await params;
  return isLinkState(state) ? { title: linkCopy(state).title, robots: { index: false } } : {};
}

export default async function Page({ params }: PageProps<"/link/[state]">) {
  const { state } = await params;
  if (!isLinkState(state)) notFound();
  return <DrawerState {...linkCopy(state)} action={{ href: "/", text: "back to the library", button: true }} />;
}
