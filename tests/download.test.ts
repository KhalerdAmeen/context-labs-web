import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as download } from "@/app/api/download/route";
import { GET as file } from "@/app/api/file/route";
import { LINK_TTL_MS, signedFileUrl, verifyFileLink } from "@/lib/server/signed-link";

const SECRET = "test-secret-0123456789abcdef0123456789";
const NOW = Date.UTC(2026, 9, 21, 12);
const zipPath = (name: string) => path.join(process.cwd(), "content/kits/context-labs/files", name);
const params = (url: string) => new URL(url).searchParams;

describe("signed links", () => {
  const url = signedFileUrl("https://context-labs.net", "context-labs-setup.zip", SECRET, NOW);

  it("verifies a fresh link and expires after exactly 7 days", () => {
    expect(url).toMatch(/^https:\/\/context-labs\.net\/api\/file\?f=context-labs-setup\.zip&e=\d{13}&s=/);
    expect(verifyFileLink(params(url), SECRET, NOW)).toEqual({ ok: true, file: "context-labs-setup.zip" });
    expect(verifyFileLink(params(url), SECRET, NOW + LINK_TTL_MS)).toMatchObject({ ok: true });
    expect(verifyFileLink(params(url), SECRET, NOW + LINK_TTL_MS + 1)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects a link pointed at another file", () => {
    const p = params(url);
    p.set("f", "context-labs-kit.zip");
    expect(verifyFileLink(p, SECRET, NOW)).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("treats a stretched expiry as tampering, not as valid or merely expired", () => {
    const p = params(url);
    p.set("e", String(Number(p.get("e")) + LINK_TTL_MS));
    expect(verifyFileLink(p, SECRET, NOW)).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects another secret's signature and edited signatures", () => {
    expect(verifyFileLink(params(url), "another-secret-entirely-0123456789", NOW)).toEqual({ ok: false, reason: "bad-signature" });
    const p = params(url);
    const s = p.get("s")!;
    p.set("s", (s[0] === "A" ? "B" : "A") + s.slice(1));
    expect(verifyFileLink(p, SECRET, NOW)).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("refuses path traversal and odd names before checking anything else", () => {
    for (const f of ["../../.env", "..%2F..%2Fpackage.json", "kits/context-labs/files/context-labs-kit.zip", "Context.zip", "x.zip/..", ""]) {
      const p = params(url);
      p.set("f", f);
      expect(verifyFileLink(p, SECRET, NOW), f).toEqual({ ok: false, reason: "malformed" });
    }
    expect(() => signedFileUrl("https://x", "../secret.zip", SECRET)).toThrow();
  });
});

describe("GET /api/file", () => {
  beforeEach(() => vi.stubEnv("DOWNLOAD_SIGNING_SECRET", SECRET));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("streams the exact zip as an attachment, uncached", async () => {
    const res = await file(new Request(signedFileUrl("http://localhost", "context-labs-kit.zip", SECRET)));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/zip");
    expect(res.headers.get("content-disposition")).toBe('attachment; filename="context-labs-kit.zip"');
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(Buffer.from(await res.arrayBuffer()).equals(readFileSync(zipPath("context-labs-kit.zip")))).toBe(true);
  });

  it("answers an expired link with 410 and plain words", async () => {
    const url = signedFileUrl("http://localhost", "context-labs-setup.zip", SECRET, Date.now() - LINK_TTL_MS - 1000);
    const res = await file(new Request(url));
    expect(res.status).toBe(410);
    expect(await res.text()).toMatch(/expired/);
  });

  it("404s a tampered link and a well-signed link to a file that isn't in the folder", async () => {
    const tampered = signedFileUrl("http://localhost", "context-labs-setup.zip", SECRET).replace("setup", "review");
    expect((await file(new Request(tampered))).status).toBe(404);
    const ghost = signedFileUrl("http://localhost", "not-a-real-kit.zip", SECRET);
    expect((await file(new Request(ghost))).status).toBe(404);
  });
});

describe("POST /api/download", () => {
  const req = (body: unknown) => new Request("http://localhost/api/download", { method: "POST", body: JSON.stringify(body) });
  beforeEach(() => {
    vi.stubEnv("DOWNLOAD_SIGNING_SECRET", SECRET);
    vi.stubEnv("SITE_URL", "https://context-labs.net");
    vi.stubEnv("LOOPS_API_KEY", "k");
    vi.stubEnv("LOOPS_TRANSACTIONAL_ID", "tx-1");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("emails a signed link to the entry's own zip, and doesn't unsubscribe an existing contact", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(Response.json([{ id: "c1" }])) // find → exists
      .mockResolvedValueOnce(Response.json({ success: true })) // update
      .mockResolvedValueOnce(Response.json({ success: true })); // transactional
    vi.stubGlobal("fetch", fetchSpy);

    const res = await download(req({ slug: "setup", email: "me@khalid.co", optIn: false }));
    expect(res.status).toBe(200);

    const update = JSON.parse(fetchSpy.mock.calls[1][1].body);
    expect(update).toEqual({ email: "me@khalid.co", source: "setup" });

    const [txUrl, txInit] = fetchSpy.mock.calls[2];
    expect(txUrl).toContain("/transactional");
    expect(txInit.headers["Idempotency-Key"]).toMatch(/^[a-f0-9]{64}$/);
    const tx = JSON.parse(txInit.body);
    expect(tx.transactionalId).toBe("tx-1");
    const link = tx.dataVariables.downloadUrl as string;
    expect(link).toMatch(/^https:\/\/context-labs\.net\/api\/file\?f=context-labs-setup\.zip&/);
    expect(verifyFileLink(params(link), SECRET)).toEqual({ ok: true, file: "context-labs-setup.zip" });
  });

  it("gives the kit page the kit bundle", async () => {
    const fetchSpy = vi.fn().mockResolvedValueOnce(Response.json([])).mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal("fetch", fetchSpy);
    await download(req({ slug: "context-labs", email: "new@person.co", optIn: true }));
    expect(JSON.parse(fetchSpy.mock.calls[1][1].body)).toEqual({ email: "new@person.co", source: "context-labs", subscribed: true });
    expect(JSON.parse(fetchSpy.mock.calls[2][1].body).dataVariables.downloadUrl).toContain("f=context-labs-kit.zip");
  });

  it("counts Loops' 409 (same email moments ago) as sent", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(Response.json([{ id: "c1" }]))
        .mockResolvedValueOnce(Response.json({ success: true }))
        .mockResolvedValueOnce(Response.json({ success: false, message: "Idempotency key already used" }, { status: 409 })),
    );
    expect((await download(req({ slug: "review", email: "a@b.co" }))).status).toBe(200);
  });

  it("never sends for a honeypot, an unknown slug, a draft or a bad email", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect((await download(req({ slug: "setup", email: "bot@spam.co", company: "Acme" }))).status).toBe(200);
    expect((await download(req({ slug: "no-such-kit", email: "a@b.co" }))).status).toBe(404);
    expect((await download(req({ slug: "../../etc", email: "a@b.co" }))).status).toBe(400);
    expect((await download(req({ slug: "app-review-rules", email: "a@b.co" }))).status).toBe(404); // no zip
    expect((await download(req({ slug: "setup", email: "nope" }))).status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("hides failures behind one generic message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ success: false, message: "secret internals" }, { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await download(req({ slug: "setup", email: "a@b.co" }));
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("secret internals");
  });

  it("refuses to sign in production without a secret", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DOWNLOAD_SIGNING_SECRET", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await download(req({ slug: "setup", email: "a@b.co" }))).status).toBe(500);
  });
});
