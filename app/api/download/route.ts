import { createHash } from "node:crypto";
import { getEntryBySlug } from "@/lib/content";
import { linkOrigin, signingSecret, zipNameOf } from "@/lib/server/downloads";
import { downloadInput, json, MESSAGES } from "@/lib/server/forms";
import { downloadContact, loops, LoopsError } from "@/lib/server/loops";
import { isRateLimited } from "@/lib/server/rate-limit";
import { signedFileUrl } from "@/lib/server/signed-link";

// POST { slug, email, optIn, company } → Loops contact (source = slug) + a transactional email whose
// `downloadUrl` is a signed /api/file link valid for 7 days. The client never names a file: the slug
// maps to its zip here.

/** Same email + entry within 10 minutes = one send (double clicks, retries). */
function idempotencyKey(email: string, slug: string, now = Date.now()) {
  const bucket = Math.floor(now / (10 * 60 * 1000));
  return createHash("sha256").update(`${email}\n${slug}\n${bucket}`).digest("hex");
}

export async function POST(request: Request) {
  if (await isRateLimited(request)) return json(429, { error: MESSAGES.limited });

  const parsed = downloadInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json(400, { error: MESSAGES.invalid });
  const { slug, email, optIn, company } = parsed.data;
  if (company) return json(200, { ok: true }); // honeypot: look successful, do nothing

  const entry = getEntryBySlug(slug);
  if (!entry?.download) return json(404, { error: MESSAGES.generic });

  const secret = signingSecret();
  if (!secret) {
    console.error("[download] DOWNLOAD_SIGNING_SECRET missing");
    return json(500, { error: MESSAGES.generic });
  }
  const downloadUrl = signedFileUrl(linkOrigin(request), zipNameOf(entry.download), secret);

  const apiKey = process.env.LOOPS_API_KEY;
  const transactionalId = process.env.LOOPS_TRANSACTIONAL_ID;
  if (!apiKey || !transactionalId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[download] Loops not configured — dev only, not emailed. Link for ${email}:\n${downloadUrl}`);
      return json(200, { ok: true });
    }
    console.error("[download] LOOPS_API_KEY or LOOPS_TRANSACTIONAL_ID missing");
    return json(500, { error: MESSAGES.generic });
  }

  try {
    const client = loops(apiKey);
    const exists = await client.contactExists(email);
    await client.updateContact(downloadContact({ email, slug, optIn, exists }));
    await client
      .sendTransactional({ transactionalId, email, dataVariables: { downloadUrl }, idempotencyKey: idempotencyKey(email, slug) })
      .catch((e) => {
        // 409: this exact email went out moments ago — that's a success for the person clicking
        if (!(e instanceof LoopsError && / 409 /.test(e.message))) throw e;
      });
    return json(200, { ok: true });
  } catch (e) {
    console.error("[download]", e);
    return json(502, { error: MESSAGES.generic });
  }
}
