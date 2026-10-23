// Branded emails for Loops (uploaded as a zip: index.mjml at the root, images in img/).
//   npm run email:zip      → validates emails/download/index.mjml, writes emails/download.zip
//   npm run email:preview  → renders emails/download/preview.html (a skill zip) and preview-kit.html
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
// What Loops substitutes for {DATA_VARIABLE:…}, as /api/download sends it (lib/server/downloads.ts
// emailVariables); only used for the local previews: a skill zip and the kit zip.
const link = (f) => `https://context-labs.net/api/file?f=${f}&e=1793211116094&s=sample-signature-for-preview-only-0000000`;
const APP_PATH = "in the Claude app, Settings → Features → Skills";
const SAMPLES = {
  "preview.html": { downloadUrl: link("context-labs-setup.zip"), fileName: "context-labs-setup.zip", nextStep: `next: ${APP_PATH} → upload the .zip` },
  "preview-kit.html": { downloadUrl: link("context-labs-kit.zip"), fileName: "context-labs-kit.zip", nextStep: `next: unzip it first, then ${APP_PATH} → upload each .zip` },
};

function render() {
  const out = mjml2html(readFileSync(src, "utf8"), { validationLevel: "strict", filePath: src });
  if (out.errors.length) {
    for (const e of out.errors) console.error(`${src}:${e.line} ${e.message}`);
    process.exit(1);
  }
  return out.html;
}

if (cmd === "preview") {
  const html = render();
  for (const [out, vars] of Object.entries(SAMPLES)) {
    const filled = html.replace(/\{DATA_VARIABLE:(\w+)\}/g, (m, k) => vars[k] ?? m);
    const left = filled.match(/\{DATA_VARIABLE:\w+\}/g);
    if (left) throw new Error(`preview: no sample for ${[...new Set(left)].join(", ")}`);
    writeFileSync(path.join(dir, out), filled);
    console.log(`email:preview → ${path.join(dir, out)}`);
  }
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
