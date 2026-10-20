import { json, MESSAGES, waitlistInput } from "@/lib/server/forms";
import { loops, waitlistContact } from "@/lib/server/loops";
import { isRateLimited } from "@/lib/server/rate-limit";

// POST { email, company } → Loops contact on the "Launch" list (source "waitlist"). No download.

export async function POST(request: Request) {
  if (await isRateLimited("waitlist", request)) return json(429, { error: MESSAGES.limited });

  const parsed = waitlistInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json(400, { error: MESSAGES.invalid });
  const { email, company } = parsed.data;
  if (company) return json(200, { ok: true }); // honeypot: look successful, do nothing

  const apiKey = process.env.LOOPS_API_KEY;
  const listId = process.env.LOOPS_LAUNCH_LIST_ID;
  if (!apiKey || !listId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[waitlist] LOOPS_API_KEY / LOOPS_LAUNCH_LIST_ID not set — skipped Loops (dev only)");
      return json(200, { ok: true });
    }
    console.error("[waitlist] LOOPS_API_KEY or LOOPS_LAUNCH_LIST_ID missing");
    return json(500, { error: MESSAGES.generic });
  }

  try {
    const client = loops(apiKey);
    const exists = await client.contactExists(email);
    await client.updateContact(waitlistContact({ email, listId, exists }));
    return json(200, { ok: true });
  } catch (e) {
    console.error("[waitlist]", e);
    return json(502, { error: MESSAGES.generic });
  }
}
