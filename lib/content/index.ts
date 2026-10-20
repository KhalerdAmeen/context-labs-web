import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { frontmatterSchema, type Frontmatter } from "./schema";

// Reads /content/<type>/<slug>/index.md at build time. Synchronous on purpose: pages stay fully
// prerendered under Cache Components, and the content set is small. Any broken reference throws,
// which fails the build instead of shipping a dead link.

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type EntryType = Frontmatter["type"];
export const TYPE_DIRS = { kit: "kits", skill: "skills", context: "context" } as const satisfies Record<EntryType, string>;

/** A text file shown in "what's inside" or copied by a button. `path` is relative to the entry. */
export type EntryFile = { path: string; text: string };

export type Entry = Frontmatter & {
  slug: string;
  href: string;
  /** "what's inside": skill files, a kit's skills' files (prefixed "setup/…"), or a kit's own files */
  inside: EntryFile[];
  /** context entries: the file "copy file" / "download .md" deliver */
  fileText?: string;
  /** kits: the file "copy context template" copies */
  templateText?: string;
};

const TEXT_EXT = /\.(md|txt)$/;

function read(rel: string) {
  return readFileSync(path.join(CONTENT_DIR, rel), "utf8");
}

/** Text files under a folder, SKILL.md first, then by path. */
function textFiles(dir: string, prefix = ""): EntryFile[] {
  if (!existsSync(dir)) return [];
  const out: EntryFile[] = [];
  const walk = (d: string, rel: string) => {
    for (const name of readdirSync(d).sort()) {
      const abs = path.join(d, name);
      const r = rel ? `${rel}/${name}` : name;
      if (statSync(abs).isDirectory()) walk(abs, r);
      else if (TEXT_EXT.test(name)) out.push({ path: prefix + r, text: readFileSync(abs, "utf8").replace(/\n$/, "") });
    }
  };
  walk(dir, "");
  const rank = (f: EntryFile) => (f.path.endsWith("SKILL.md") ? 0 : 1);
  return out.sort((a, b) => a.path.split("/").length - b.path.split("/").length || rank(a) - rank(b) || a.path.localeCompare(b.path));
}

function loadAll(): Entry[] {
  const entries: Entry[] = [];
  for (const [type, dir] of Object.entries(TYPE_DIRS) as [EntryType, string][]) {
    const typeDir = path.join(CONTENT_DIR, dir);
    if (!existsSync(typeDir)) continue;
    for (const slug of readdirSync(typeDir).sort()) {
      const indexPath = path.join(dir, slug, "index.md");
      if (!existsSync(path.join(CONTENT_DIR, indexPath))) continue;
      const parsed = frontmatterSchema.safeParse(matter(read(indexPath)).data);
      if (!parsed.success) throw new Error(`content/${indexPath}: ${parsed.error.message}`);
      const fm = parsed.data;
      if (fm.type !== type) throw new Error(`content/${indexPath}: type "${fm.type}" doesn't match folder "${dir}"`);
      entries.push({ ...fm, slug, href: `/${dir}/${slug}`, inside: [] });
    }
  }

  const bySlug = new Map<string, Entry>();
  for (const e of entries) {
    if (bySlug.has(e.slug)) throw new Error(`content: slug "${e.slug}" is used twice; slugs are unique across types`);
    bySlug.set(e.slug, e);
  }
  const need = (e: Entry, ref: string, what: string) => {
    if (!bySlug.has(ref)) throw new Error(`content: ${e.href} ${what} "${ref}" doesn't exist`);
  };
  const needFile = (e: Entry, rel: string, what: string) => {
    if (!existsSync(path.join(CONTENT_DIR, rel))) throw new Error(`content: ${e.href} ${what} "content/${rel}" is missing`);
  };

  for (const e of entries) {
    const own = path.join(CONTENT_DIR, TYPE_DIRS[e.type], e.slug, "files");
    e.related.forEach((r) => need(e, r, "related"));
    if (e.download) needFile(e, e.download, "download");

    if (e.type === "kit") {
      e.skills.forEach((s) => need(e, s, "skill"));
      e.inside = e.skills.length
        ? e.skills.flatMap((s) => textFiles(path.join(CONTENT_DIR, TYPE_DIRS.skill, s, "files"), `${s}/`))
        : textFiles(own);
      if (e.template) {
        needFile(e, e.template, "template");
        e.templateText = read(e.template).replace(/\n$/, "");
      }
    } else if (e.type === "skill") {
      if (e.kit) need(e, e.kit, "kit");
      e.inside = textFiles(own);
    } else {
      const rel = path.join(TYPE_DIRS.context, e.slug, "files", e.file);
      needFile(e, rel, "file");
      e.fileText = read(rel).replace(/\n$/, "");
    }
  }

  return entries.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

let all: Entry[] | null = null;
function allEntries() {
  return (all ??= loadAll());
}

/** Drafts are visible in dev and hidden in every production build (including Vercel previews). */
export const includeDraftsByDefault = process.env.NODE_ENV !== "production";

export function getEntries({ includeDrafts = includeDraftsByDefault } = {}): Entry[] {
  const visible = allEntries().filter((e) => includeDrafts || !e.draft);
  const shown = new Set(visible.map((e) => e.slug));
  // never link a published page to a hidden draft
  return visible.map((e) => ({ ...e, related: e.related.filter((r) => shown.has(r)) }));
}

export function getEntry(type: EntryType, slug: string, opts?: { includeDrafts?: boolean }): Entry | undefined {
  return getEntries(opts).find((e) => e.type === type && e.slug === slug);
}

export function getEntryBySlug(slug: string, opts?: { includeDrafts?: boolean }): Entry | undefined {
  return getEntries(opts).find((e) => e.slug === slug);
}
