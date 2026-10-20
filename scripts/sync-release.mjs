// Pull a context-labs release into this repo. Usage: npm run sync:release -- v0.1.0
//  1. downloads the release's skill zips into content/kits/context-labs/files/
//  2. unpacks each skill's files into content/skills/<slug>/files/ (read at build for "what's inside")
//  3. re-bundles context-labs-kit.zip
// Zips are never unpacked during the site build — only here, when you sync.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { unzipSync } from "fflate";
import { bundleKit, KIT_DIR, KIT_ZIP } from "./bundle-kit.mjs";

const REPO = "KhalerdAmeen/context-labs";
const tag = process.argv[2];
if (!tag) {
  console.error("usage: npm run sync:release -- <tag>   e.g. v0.1.0");
  process.exit(1);
}

execFileSync("gh", ["release", "download", tag, "-R", REPO, "-D", KIT_DIR, "-p", "context-labs-*.zip", "--clobber"], {
  stdio: "inherit",
});

for (const zip of readdirSync(KIT_DIR).filter((f) => /^context-labs-.+\.zip$/.test(f) && f !== KIT_ZIP)) {
  const slug = zip.replace(/^context-labs-/, "").replace(/\.zip$/, "");
  const outDir = path.join("content/skills", slug, "files");
  rmSync(outDir, { recursive: true, force: true });

  const files = unzipSync(new Uint8Array(readFileSync(path.join(KIT_DIR, zip))));
  let count = 0;
  for (const [name, data] of Object.entries(files)) {
    if (name.endsWith("/")) continue;
    // strip the top folder ("context-labs-setup/SKILL.md" → "SKILL.md"); refuse anything that escapes
    const rel = path.normalize(name.split("/").slice(1).join("/"));
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) throw new Error(`sync-release: bad path in ${zip}: ${name}`);
    mkdirSync(path.dirname(path.join(outDir, rel)), { recursive: true });
    writeFileSync(path.join(outDir, rel), data);
    count++;
  }
  console.log(`skills/${slug}/files ← ${zip} (${count} files)`);
}

bundleKit();
console.log(`${KIT_ZIP} rebuilt. Bump the "version" fact in content/kits/context-labs/index.md to ${tag}.`);
