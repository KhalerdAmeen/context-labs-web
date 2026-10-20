// Packs the skill zips, unchanged, into context-labs-kit.zip (a zip of zips: the Claude app
// takes one .zip per skill). Runs before every build so the bundle can't go stale.
// Output is byte-identical across machines: fixed timezone + fixed mtimes.
process.env.TZ = "UTC";

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zipSync } from "fflate";

export const KIT_DIR = "content/kits/context-labs/files";
export const KIT_ZIP = "context-labs-kit.zip";
const MTIME = new Date("2026-01-01T00:00:00Z");

export function bundleKit(dir = KIT_DIR) {
  const skillZips = readdirSync(dir)
    .filter((f) => f.endsWith(".zip") && f !== KIT_ZIP)
    .sort();
  if (skillZips.length === 0) throw new Error(`bundle-kit: no skill zips in ${dir}`);

  const entries = Object.fromEntries(
    skillZips.map((f) => [f, [readFileSync(path.join(dir, f)), { level: 0, mtime: MTIME }]]),
  );
  writeFileSync(path.join(dir, KIT_ZIP), zipSync(entries));
  return skillZips;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const zips = bundleKit();
  console.log(`bundle-kit: ${KIT_ZIP} ← ${zips.join(", ")}`);
}
