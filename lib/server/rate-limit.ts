import "server-only";
import { checkRateLimit } from "@vercel/firewall";

// Per-IP rate limits from the Vercel Firewall. Each id needs a matching "@vercel/firewall" rule in
// Vercel → Firewall (see .env.example). Enforced only on Vercel; locally nothing is limited.
// If the check itself fails we let the request through and log it: a broken limiter must not
// lock real people out of a download.

export type RateLimitId = "download" | "waitlist";

export async function isRateLimited(id: RateLimitId, request: Request): Promise<boolean> {
  if (!process.env.VERCEL) return false;
  try {
    const { rateLimited, error } = await checkRateLimit(id, { request, timeout: 1000 });
    if (error === "not-found") console.error(`[rate-limit] no Firewall rule with id "${id}" — requests are not limited`);
    return rateLimited;
  } catch (e) {
    console.error(`[rate-limit] check for "${id}" failed, letting the request through`, e);
    return false;
  }
}
