import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { FILE_NAME } from "./signed-link";

// Where the zips live (never /public) and how links get built. See CONTEXT.md → Zip artifacts.

export const DOWNLOAD_REL = "kits/context-labs/files";
export const DOWNLOAD_DIR = path.join(process.cwd(), "content", DOWNLOAD_REL);

/** The zip name behind an entry's `download` (e.g. "kits/context-labs/files/context-labs-setup.zip"). */
export function zipNameOf(download: string) {
  const name = path.posix.basename(download);
  if (path.posix.dirname(download) !== DOWNLOAD_REL || !FILE_NAME.test(name)) throw new Error(`download outside ${DOWNLOAD_REL}: ${download}`);
  return name;
}

/** The zip's bytes, only if `name` is one of the files actually in the downloads folder. */
export function readZip(name: string): Buffer | null {
  if (!FILE_NAME.test(name) || !existsSync(DOWNLOAD_DIR)) return null;
  if (!readdirSync(DOWNLOAD_DIR).includes(name)) return null; // allowlist: exact names on disk only
  return readFileSync(path.join(DOWNLOAD_DIR, name));
}

/** The signing secret. Dev may fall back to a fixed one; production must have the env var. */
export function signingSecret(): string | null {
  const s = process.env.DOWNLOAD_SIGNING_SECRET;
  if (s) return s;
  return process.env.NODE_ENV === "production" ? null : "dev-only-signing-secret-not-for-production";
}

/**
 * Origin for links in emails. Previews point at their own branch URL, so a test download from a
 * preview downloads from that preview; production uses SITE_URL; dev uses the request's origin.
 */
export function linkOrigin(request: Request) {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`;
  return process.env.SITE_URL || new URL(request.url).origin;
}
