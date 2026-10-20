// Kept apart from schema.ts so client components can import it without pulling in zod.
export const TOOLS = ["claude app", "claude code", "claude design"] as const;
export type Tool = (typeof TOOLS)[number];
