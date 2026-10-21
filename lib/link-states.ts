// Where /api/file sends people whose download link didn't work: a styled page with a way back.

export const LINK_STATES = ["expired", "invalid"] as const;
export type LinkState = (typeof LINK_STATES)[number];
export const isLinkState = (s: string): s is LinkState => (LINK_STATES as readonly string[]).includes(s);

export function linkCopy(state: LinkState, entryTitle?: string) {
  const where = entryTitle ? `the ${entryTitle} page` : "the kit's page";
  return state === "expired"
    ? { label: "link expired", title: "this link has expired", body: `download links work for 7 days. get a fresh one from ${where} — it takes a few seconds.` }
    : { label: "link invalid", title: "this link isn't valid", body: `it may have been copied incompletely. get a fresh one from ${where}.` };
}
