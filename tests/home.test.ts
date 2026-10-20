import { afterEach, describe, expect, it, vi } from "vitest";
import { fillerCount, shownAt, units } from "@/lib/grid";
import { downloadContact, waitlistContact } from "@/lib/server/loops";
import { POST } from "@/app/api/waitlist/route";

describe("drawer grid", () => {
  const prod = [{ wide: true }, { wide: false }, { wide: false }, { wide: false }, { wide: true }]; // kit, 3 skills, submit tile

  it("closes the last row at every breakpoint", () => {
    expect(units(prod, "d")).toBe(7);
    expect(fillerCount(units(prod, "d"), "d")).toBe(1);
    expect(fillerCount(units(prod, "t"), "t")).toBe(1);
    expect(fillerCount(units(prod, "m"), "m")).toBe(0);
  });

  it("shows a cell only where the breakpoint needs it", () => {
    expect(shownAt(0, { m: 0, t: 1, d: 1 })).toBe("hidden t:block");
    expect(shownAt(2, { m: 3, t: 3, d: 7 }, "flex")).toBe("flex");
    expect(shownAt(5, { m: 3, t: 3, d: 7 }, "flex")).toBe("hidden d:flex");
  });
});

describe("Loops contact bodies (an unticked box must never unsubscribe anyone)", () => {
  it("download, new contact: subscribed is exactly the opt-in", () => {
    expect(downloadContact({ email: "a@b.co", slug: "setup", optIn: false, exists: false })).toEqual({ email: "a@b.co", source: "setup", subscribed: false });
    expect(downloadContact({ email: "a@b.co", slug: "setup", optIn: true, exists: false })).toMatchObject({ subscribed: true });
  });

  it("download, existing contact: unticked leaves subscribed out, ticked subscribes", () => {
    expect(downloadContact({ email: "a@b.co", slug: "setup", optIn: false, exists: true })).not.toHaveProperty("subscribed");
    expect(downloadContact({ email: "a@b.co", slug: "setup", optIn: true, exists: true })).toMatchObject({ subscribed: true });
  });

  it("waitlist: joins the Launch list; source only on creation", () => {
    expect(waitlistContact({ email: "a@b.co", listId: "L1", exists: false })).toEqual({ email: "a@b.co", source: "waitlist", subscribed: true, mailingLists: { L1: true } });
    expect(waitlistContact({ email: "a@b.co", listId: "L1", exists: true })).not.toHaveProperty("source");
  });
});

describe("POST /api/waitlist", () => {
  const req = (body: unknown) => new Request("http://x/api/waitlist", { method: "POST", body: JSON.stringify(body) });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects a bad email with the plain message", async () => {
    const res = await POST(req({ email: "nope" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "enter a valid email." });
  });

  it("answers a filled honeypot with a fake success and never calls Loops", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    vi.stubEnv("LOOPS_API_KEY", "k");
    vi.stubEnv("LOOPS_LAUNCH_LIST_ID", "L1");
    const res = await POST(req({ email: "bot@spam.co", company: "Acme" }));
    expect(res.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("looks the contact up, then adds it to the Launch list", async () => {
    vi.stubEnv("LOOPS_API_KEY", "k");
    vi.stubEnv("LOOPS_LAUNCH_LIST_ID", "L1");
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(Response.json([])) // find → not found
      .mockResolvedValueOnce(Response.json({ success: true, id: "c1" })); // update
    vi.stubGlobal("fetch", fetchSpy);
    const res = await POST(req({ email: "new@person.co" }));
    expect(res.status).toBe(200);
    expect(fetchSpy.mock.calls[0][0]).toContain("/contacts/find?email=new%40person.co");
    const [url, init] = fetchSpy.mock.calls[1];
    expect(url).toContain("/contacts/update");
    expect(JSON.parse(init.body)).toEqual({ email: "new@person.co", source: "waitlist", subscribed: true, mailingLists: { L1: true } });
  });

  it("hides Loops failures behind the generic message", async () => {
    vi.stubEnv("LOOPS_API_KEY", "k");
    vi.stubEnv("LOOPS_LAUNCH_LIST_ID", "L1");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ success: false, message: "internal detail" }, { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(req({ email: "a@b.co" }));
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("internal detail");
  });
});
