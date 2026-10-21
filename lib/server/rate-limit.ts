import "server-only";
import { checkRateLimit } from "@vercel/firewall";

// Per-IP rate limit from the Vercel Firewall. Vercel Hobby allows one rate-limit rule, so both email
// forms (/api/download and /api/waitlist) share it: a "@vercel/firewall" rule with this ID.
// Enforced only on Vercel; locally nothing is limited. If the check itself fails we let the request
// through and log it: a broken limiter must not lock real people out of a download.

export const RATE_LIMIT_ID = "download";

export async function isRateLimited(request: Request): Promise<boolean> {
  if (!process.env.VERCEL) return false;
  try {
    const { rateLimited, error } = await checkRateLimit(RATE_LIMIT_ID, { request, timeout: 1000 });
    if (error === "not-found") console.error(`[rate-limit] no Firewall rule with id "${RATE_LIMIT_ID}" — requests are not limited`);
    return rateLimited;
  } catch (e) {
    console.error(`[rate-limit] check for "${RATE_LIMIT_ID}" failed, letting the request through`, e);
    return false;
  }
}
