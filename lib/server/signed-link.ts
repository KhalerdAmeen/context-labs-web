import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Private download links: /api/file?f=<zip>&e=<expiry ms>&s=<signature>.
// The signature is an HMAC-SHA256 over the file name and expiry with DOWNLOAD_SIGNING_SECRET, so a
// link can't be edited to point at another file or live longer, and it dies after 7 days.

export const LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** Only plain zip names from the downloads folder; anything with a slash or dots is refused. */
export const FILE_NAME = /^[a-z0-9][a-z0-9-]*\.zip$/;

const sign = (file: string, exp: number, secret: string) => createHmac("sha256", secret).update(`${file}\n${exp}`).digest("base64url");

export function signedFileUrl(base: string, file: string, secret: string, now = Date.now()) {
  if (!FILE_NAME.test(file)) throw new Error(`signedFileUrl: refusing file name "${file}"`);
  const exp = now + LINK_TTL_MS;
  const q = new URLSearchParams({ f: file, e: String(exp), s: sign(file, exp, secret) });
  return `${base.replace(/\/$/, "")}/api/file?${q}`;
}

export type LinkCheck = { ok: true; file: string } | { ok: false; reason: "malformed" | "expired" | "bad-signature" };

export function verifyFileLink(params: URLSearchParams, secret: string, now = Date.now()): LinkCheck {
  const file = params.get("f") ?? "";
  const expRaw = params.get("e") ?? "";
  const sig = params.get("s") ?? "";
  if (!FILE_NAME.test(file) || !/^\d{13}$/.test(expRaw) || !/^[A-Za-z0-9_-]{43}$/.test(sig)) return { ok: false, reason: "malformed" };

  const exp = Number(expRaw);
  // check the signature before the expiry, so an edited expiry reads as tampering, not as "expired"
  const expected = Buffer.from(sign(file, exp, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "bad-signature" };
  if (now > exp) return { ok: false, reason: "expired" };
  return { ok: true, file };
}
