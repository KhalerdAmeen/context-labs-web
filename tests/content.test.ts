import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { CONTENT_DIR, getEntries, getEntryBySlug } from "@/lib/content";
import { frontmatterSchema } from "@/lib/content/schema";

const published = getEntries({ includeDrafts: false });
const everything = getEntries({ includeDrafts: true });

describe("content set", () => {
  it("publishes exactly the Context Labs kit, its three skills and the app review rules, in grid order", () => {
    expect(published.map((e) => `${e.type}/${e.slug}`)).toEqual([
      "kit/context-labs",
      "skill/setup",
      "skill/handoff",
      "skill/review",
      "context/app-review-rules",
    ]);
  });

  it("keeps the nine export placeholders as drafts (visible in dev only)", () => {
    const drafts = everything.filter((e) => e.draft);
    expect(drafts).toHaveLength(9);
    expect(everything).toHaveLength(14);
  });

  it("never links a published page to a draft", () => {
    const shown = new Set(published.map((e) => e.slug));
    for (const e of published) for (const r of e.related) expect(shown.has(r), `${e.href} → ${r}`).toBe(true);
  });
});

describe("the kit and its skills", () => {
  const kit = getEntryBySlug("context-labs", { includeDrafts: false })!;

  it("bundles setup, handoff and review, and each skill links back to the kit", () => {
    expect(kit.type === "kit" && kit.skills).toEqual(["setup", "handoff", "review"]);
    for (const slug of ["setup", "handoff", "review"]) {
      const skill = getEntryBySlug(slug, { includeDrafts: false })!;
      expect(skill.type === "skill" && skill.kit).toBe("context-labs");
      expect(skill.related[0]).toBe("context-labs");
    }
  });

  it("shows each skill's files in what's inside, SKILL.md first", () => {
    const setup = getEntryBySlug("setup")!;
    expect(setup.inside.map((f) => f.path)).toEqual([
      "SKILL.md",
      "references/mobile-rules.md",
      "references/questions.md",
      "references/template.md",
      "references/where-to-look.md",
    ]);
    expect(kit.inside).toHaveLength(12);
    expect(kit.inside[0].path).toBe("setup/SKILL.md");
  });

  it("copies the real CONTEXT.md template for 'copy context template'", () => {
    expect(kit.type === "kit" && kit.templateText).toMatch(/^# CONTEXT\.md template/);
  });
});

describe("app review rules", () => {
  it("ships setup's mobile-rules.md verbatim, credited to Khalid", () => {
    const e = getEntryBySlug("app-review-rules", { includeDrafts: false })!;
    const original = readFileSync(path.join(CONTENT_DIR, "skills/setup/files/references/mobile-rules.md"), "utf8").replace(/\n$/, "");
    expect(e.type === "context" && e.fileText).toBe(original);
    expect(e.author).toBe("khalid");
    expect(e.draft).toBe(false);
  });
});

describe("downloads", () => {
  it("every .zip lives in content/kits/context-labs/files, never in public/", () => {
    for (const e of everything.filter((x) => x.download)) {
      expect(e.download!.startsWith("kits/context-labs/files/"), e.href).toBe(true);
      expect(existsSync(path.join(CONTENT_DIR, e.download!))).toBe(true);
    }
    expect(existsSync(path.join(process.cwd(), "public", "context-labs-kit.zip"))).toBe(false);
  });

  it("the kit zip holds the three skill zips, byte for byte", () => {
    const dir = path.join(CONTENT_DIR, "kits/context-labs/files");
    const inner = unzipSync(new Uint8Array(readFileSync(path.join(dir, "context-labs-kit.zip"))));
    expect(Object.keys(inner).sort()).toEqual(["context-labs-handoff.zip", "context-labs-review.zip", "context-labs-setup.zip"]);
    for (const [name, bytes] of Object.entries(inner)) {
      expect(Buffer.from(bytes).equals(readFileSync(path.join(dir, name))), name).toBe(true);
    }
  });
});

describe("install copy (CONTEXT.md overrides the export)", () => {
  for (const e of published.filter((x) => x.type !== "context")) {
    it(`${e.href}: Claude Code tab is the two marketplace commands`, () => {
      const code = e.install.find((t) => t.key === "code")!;
      expect(code.steps.slice(0, 2)).toEqual([
        { command: "/plugin marketplace add KhalerdAmeen/context-labs" },
        { command: "/plugin install context-labs@context-labs" },
      ]);
      expect(JSON.stringify(code.steps)).not.toMatch(/~\/\.claude\/skills|unzip/);
    });

    it(`${e.href}: Claude app tab says Settings → Features → Skills`, () => {
      const app = JSON.stringify(e.install.find((t) => t.key === "app")!.steps);
      expect(app).toContain("Settings → Features → Skills");
      expect(app).not.toContain("Capabilities");
    });
  }
});

describe("example content", () => {
  const SAMPLE = /c41e3a|8b1a1a|e63946|reelhouse/i;

  it("carries no export sample data (#C41E3A reds, Reelhouse) outside the released skill files", () => {
    for (const e of everything) {
      const { inside, ...page } = e;
      expect(JSON.stringify(page), e.href).not.toMatch(SAMPLE);
      // a kit's own example files are ours; files synced from a release (skills/*/files) are shown as shipped
      if (e.type === "kit" && e.skills.length === 0) expect(JSON.stringify(inside), e.href).not.toMatch(SAMPLE);
    }
  });

  it("labels every example on a published page as coming from the Cram test run", () => {
    for (const e of published) {
      const blocks = e.type === "kit" ? [e.see, e.get] : e.type === "skill" ? [e.examples] : e.applied.length ? [e] : [];
      for (const b of blocks.filter(Boolean)) expect(b!.source, e.href).toMatch(/real run.*Cram, a study planner \(test project\)/);
    }
  });
});

describe("schema", () => {
  it("rejects a value split by an unquoted comma in a YAML flow mapping", () => {
    const kit = getEntryBySlug("context-labs")!;
    const broken = { ...kit, facts: [{ k: "reads", v: "your code", " docs and screenshots": null }] };
    expect(frontmatterSchema.safeParse(broken).success).toBe(false);
  });
});
