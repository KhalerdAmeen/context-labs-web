import { afterEach, describe, expect, it, vi } from "vitest";

// Vercel Hobby allows one rate-limit rule, so both email forms must ask for the same ID.
const checkRateLimit = vi.fn(async () => ({ rateLimited: true }));
vi.mock("@vercel/firewall", () => ({ checkRateLimit }));

const { POST: download } = await import("@/app/api/download/route");
const { POST: waitlist } = await import("@/app/api/waitlist/route");

const req = (url: string, body: unknown) => new Request(url, { method: "POST", body: JSON.stringify(body) });

describe("rate limiting (one Firewall rule)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    checkRateLimit.mockClear();
  });

  it("both forms check the same rule, \"download\", and answer 429 when limited", async () => {
    vi.stubEnv("VERCEL", "1");
    const a = await download(req("http://x/api/download", { slug: "setup", email: "a@b.co" }));
    const b = await waitlist(req("http://x/api/waitlist", { email: "a@b.co" }));
    expect([a.status, b.status]).toEqual([429, 429]);
    expect(checkRateLimit.mock.calls.map((c) => (c as unknown[])[0])).toEqual(["download", "download"]);
  });

  it("is off outside Vercel", async () => {
    vi.stubEnv("VERCEL", "");
    await waitlist(req("http://x/api/waitlist", { email: "nope" }));
    expect(checkRateLimit).not.toHaveBeenCalled();
  });
});
