import type { Metadata } from "next";
import { DrawerState } from "@/components/drawer-state";

export const metadata: Metadata = { title: "drawer not found", robots: { index: false } };

export default function NotFound() {
  return <DrawerState label="drawer 404" title="drawer not found" action={{ href: "/", text: "back to the library" }} />;
}
