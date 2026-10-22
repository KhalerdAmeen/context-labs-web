// Branded emails for Loops (uploaded as a zip: index.mjml at the root, images in img/).
//   npm run email:zip      → validates emails/download/index.mjml, writes emails/download.zip
//   npm run email:preview  → renders emails/download/preview.html with a sample link
// Usage: node scripts/email.mjs <zip|preview> [name=download]
process.env.TZ = "UTC";

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { zipSync } from "fflate";
import mjml2html from "mjml";

const [cmd, name = "download"] = process.argv.slice(2);
const dir = path.join("emails", name);
const src = path.join(dir, "index.mjml");
const MTIME = new Date("2026-01-01T00:00:00Z");
// what Loops substitutes for {DATA_VARIABLE:downloadUrl}; only used in the local preview
const SAMPLE = { downloadUrl: "https://context-labs.net/api/file?f=context-labs-setup.zip&e=1793211116094&s=sample-signature-for-preview-only-0000000" };

function render() {
  const out = mjml2html(readFileSync(src, "utf8"), { validationLevel: "strict", filePath: src });
  if (out.errors.length) {
    for (const e of out.errors) console.error(`${src}:${e.line} ${e.message}`);
    process.exit(1);
  }
  return out.html;
}

if (cmd === "preview") {
  const html = render().replace(/\{DATA_VARIABLE:(\w+)\}/g, (m, k) => SAMPLE[k] ?? m);
  const file = path.join(dir, "preview.html");
  writeFileSync(file, html);
  console.log(`email:preview → ${file}`);
} else if (cmd === "zip") {
  render(); // never zip a template that doesn't validate
  const files = { "index.mjml": [readFileSync(src), { mtime: MTIME }] };
  const img = path.join(dir, "img");
  if (existsSync(img)) {
    for (const f of readdirSync(img).filter((f) => !f.startsWith("."))) files[`img/${f}`] = [readFileSync(path.join(img, f)), { mtime: MTIME }];
  }
  const zip = path.join("emails", `${name}.zip`);
  writeFileSync(zip, zipSync(files));
  console.log(`email:zip → ${zip} (${Object.keys(files).join(", ")})`);
} else {
  console.error("usage: node scripts/email.mjs <zip|preview> [name]");
  process.exit(1);
}
