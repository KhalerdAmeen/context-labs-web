import "server-only";
import { z } from "zod";

// Request bodies for the email forms. `company` is a honeypot: hidden from people, filled by bots.

const email = z.email().max(254);
const honeypot = z.string().max(500).optional().default("");

export const waitlistInput = z.object({ email, company: honeypot });
export const downloadInput = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,80}$/),
  email,
  optIn: z.boolean().default(false),
  company: honeypot,
});

/** Error copy shown to people. Generic on purpose: nothing about what failed inside. */
export const MESSAGES = {
  invalid: "enter a valid email.",
  generic: "something went wrong. try again in a minute.",
  limited: "too many tries. wait a minute, then try again.",
} as const;

export function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
