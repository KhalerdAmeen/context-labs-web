import { readZip, signingSecret } from "@/lib/server/downloads";
import { verifyFileLink } from "@/lib/server/signed-link";

// GET /api/file?f=&e=&s= — the only way a zip leaves the server. People reach this from the email,
// so failures answer in plain words rather than JSON.

const text = (status: number, body: string) =>
  new Response(body + "\n", {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });

export async function GET(request: Request) {
  const secret = signingSecret();
  if (!secret) {
    console.error("[file] DOWNLOAD_SIGNING_SECRET missing");
    return text(500, "downloads are unavailable right now. try again later.");
  }

  const check = verifyFileLink(new URL(request.url).searchParams, secret);
  if (!check.ok) {
    return check.reason === "expired"
      ? text(410, "this download link has expired. links last 7 days — get a new one from the kit's page on context-labs.net.")
      : text(404, "this download link isn't valid. get a fresh one from the kit's page on context-labs.net.");
  }

  const zip = readZip(check.file);
  if (!zip) return text(404, "this download link isn't valid. get a fresh one from the kit's page on context-labs.net.");

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
