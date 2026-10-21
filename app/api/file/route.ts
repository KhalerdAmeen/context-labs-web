import path from "node:path";
import { getEntries } from "@/lib/content";
import { readZip, signingSecret } from "@/lib/server/downloads";
import { FILE_NAME, verifyFileLink } from "@/lib/server/signed-link";

// GET /api/file?f=&e=&s= — the only way a zip leaves the server. People arrive from the email, so a
// link that fails sends them (303) to a styled page with a button back to the entry it was for:
// /link/expired/<slug> or /link/invalid/<slug>, or /link/invalid when we can't tell which entry.

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

function slugForZip(file: string | null) {
  if (!file || !FILE_NAME.test(file)) return null;
  return getEntries().find((e) => e.download && path.posix.basename(e.download) === file)?.slug ?? null;
}

const goTo = (request: Request, pathname: string) =>
  new Response(null, { status: 303, headers: { Location: new URL(pathname, request.url).toString(), ...NO_STORE } });

export async function GET(request: Request) {
  const secret = signingSecret();
  if (!secret) {
    console.error("[file] DOWNLOAD_SIGNING_SECRET missing");
    return new Response("downloads are unavailable right now. try again later.\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8", ...NO_STORE },
    });
  }

  const params = new URL(request.url).searchParams;
  const check = verifyFileLink(params, secret);
  const zip = check.ok ? readZip(check.file) : null;
  if (check.ok && zip) {
    return new Response(new Uint8Array(zip), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${check.file}"`,
        "Content-Length": String(zip.length),
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  const state = !check.ok && check.reason === "expired" ? "expired" : "invalid";
  const slug = slugForZip(params.get("f"));
  return goTo(request, slug ? `/link/${state}/${slug}` : `/link/${state}`);
}
