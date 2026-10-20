export const site = {
  name: "context labs",
  description:
    "context files and skills from people who build. take one, install it, stop getting generic output.",
  author: "khalid",
  handle: "@khalerdameen",
  licence: "cc by 4.0",
  xUrl: "https://x.com/khalerdameen",
} as const;

/** Submissions are open once the Tally form id is set. The footer and /submit both read this. */
export const tallyFormId = process.env.NEXT_PUBLIC_TALLY_FORM_ID || null;
export const submissionsLabel = tallyFormId ? "submissions open" : "submissions open soon";

export type NavKey = "browse" | "submit" | "about";

export const nav: { key: NavKey; label: string; href: string }[] = [
  { key: "browse", label: "browse", href: "/" },
  { key: "submit", label: "submit", href: "/submit" },
  { key: "about", label: "about", href: "/about" },
];

/** Which top-bar link is active for a pathname. Home and entry pages count as "browse". */
export function activeNav(pathname: string): NavKey | null {
  if (pathname.startsWith("/submit")) return "submit";
  if (pathname.startsWith("/about")) return "about";
  if (pathname === "/" || /^\/(kits|skills|context)\//.test(pathname)) return "browse";
  return null;
}
