import { z } from "zod";
import { TOOLS } from "./tools";

// Frontmatter for /content/<type>/<slug>/index.md. Section data mirrors design/EntryPage.dc.html (PAGES).
// Strings may contain `code` spans in backticks; the renderer turns them into mono chips.

export { TOOLS, type Tool } from "./tools";

const lines = z.array(z.string());
// .strict() on small objects: an unquoted comma inside a YAML `{ … }` splits the value into a
// stray key, which then fails the build instead of silently truncating the text.
const fact = z.object({ k: z.string(), v: z.string() }).strict();

/** An install step: prose (with `code` spans) or a command shown with its own copy button. */
const step = z.union([z.string(), z.object({ command: z.string() }).strict()]);
const installTab = z.object({ key: z.string(), label: z.string(), steps: z.array(step).min(1) }).strict();

/** A code panel. `wrap: false` keeps wide tables on one line with a right-edge fade. */
const panel = z.object({ label: z.string(), lines, wrap: z.boolean().default(true) }).strict();

/** Where example content comes from, shown under it, e.g. "from a real run · Cram, a study planner (test project)". */
const source = z.string().optional();

const question = z.object({
  q: z.string(),
  multi: z.boolean().default(false),
  options: z.array(
    z.object({ a: z.string(), b: z.string().optional(), swatch: z.string().optional(), on: z.boolean().default(false) }).strict(),
  ),
});

const base = z.object({
  title: z.string(),
  /** card description (3 lines max on the card) */
  desc: z.string().max(140),
  /** page header description */
  intro: z.string(),
  tools: z.array(z.enum(TOOLS)).min(1),
  works: z.array(z.string()).min(1),
  /** the card's code preview */
  preview: lines,
  author: z.string().default("khalid"),
  handle: z.string().default("@khalerdameen"),
  /** YYYY-MM */
  updated: z.string().regex(/^\d{4}-\d{2}$/),
  draft: z.boolean().default(false),
  /** position in the library grid (ascending) */
  order: z.number().int(),
  tryIt: z.string(),
  facts: z.array(fact).default([]),
  install: z.array(installTab).default([]),
  related: z.array(z.string()).default([]),
  /** path under /content of the .zip behind "download .zip" (served only via the signed link) */
  download: z.string().endsWith(".zip").optional(),
});

export const kitSchema = base.extend({
  type: z.literal("kit"),
  /** skill slugs bundled in this kit; "what's inside" groups their files */
  skills: z.array(z.string()).default([]),
  /** "copy context template": path under /content of the file to copy */
  template: z.string().optional(),
  how: z.array(z.object({ t: z.string(), d: z.string() }).strict()).default([]),
  see: z.object({ header: z.string(), questions: z.array(question), note: z.string(), source }).optional(),
  get: z.object({ prompt: z.string(), label: z.string(), lines, source }).optional(),
  keep: z.string().optional(),
});

export const skillSchema = base.extend({
  type: z.literal("skill"),
  /** the kit this skill ships in; the page links back to it */
  kit: z.string().optional(),
  triggers: z.array(z.string()).default([]),
  examples: z.object({ title: z.string(), panels: z.array(panel).min(1).max(3), note: z.string().optional(), source }).optional(),
});

export const contextSchema = base.extend({
  type: z.literal("context"),
  /** the file in files/ that "copy file" and "download .md" deliver */
  file: z.string(),
  rules: lines.default([]),
  applied: lines.default([]),
  generate: z.object({ text: z.string(), href: z.string() }).optional(),
});

export const frontmatterSchema = z.discriminatedUnion("type", [kitSchema, skillSchema, contextSchema]);
export type Frontmatter = z.infer<typeof frontmatterSchema>;
