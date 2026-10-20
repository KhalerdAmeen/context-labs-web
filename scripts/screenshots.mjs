// Capture pages at the design's review widths.
// Usage: node scripts/screenshots.mjs <outDir> <path> [path…]   (BASE_URL defaults to http://localhost:3000)
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const WIDTHS = [1440, 768, 390];
const base = process.env.BASE_URL ?? "http://localhost:3000";
const [outDir, ...paths] = process.argv.slice(2);
if (!outDir || paths.length === 0) {
  console.error("usage: node scripts/screenshots.mjs <outDir> <path> [path…]");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 } });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const name = `${p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "_")}-${width}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: true });
    console.log(name);
  }
  await page.close();
}
await browser.close();
