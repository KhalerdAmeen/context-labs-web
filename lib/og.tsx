import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Entry } from "./content";
import { parseLine } from "./lines";
import { T } from "./tokens";

// Open Graph images (1200×630), built from the drawer card: badge, title, description, a faded code
// preview and the author line, inside a hairline frame. Rendered at build time: fonts are read
// synchronously (like the content), because async reads count as uncached data under Cache
// Components and would make the image render on every request.

export const OG_SIZE = { width: 1200, height: 630 };

const font = (file: string) => readFileSync(path.join(process.cwd(), "assets/fonts", file));

function fonts() {
  const [sans, sansMedium, mono, monoMedium] = ["Geist-Regular.ttf", "Geist-Medium.ttf", "GeistMono-Regular.ttf", "GeistMono-Medium.ttf"].map(font);
  return [
    { name: "Geist", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: sansMedium, weight: 500 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "Geist Mono", data: monoMedium, weight: 500 as const, style: "normal" as const },
  ];
}

// Satori measures a word with its kerning but draws it without, leaving a visible gap after words
// like "context" ("x"+"t" is a kerned pair in Geist). Text drawn as one run per line — words joined
// with no-break spaces — measures and draws the same, so we break lines ourselves.
const NBSP = "\u00a0";
function wrap(text: string, maxChars: number, maxLines: number) {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && line.length + 1 + word.length > maxChars) {
      out.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  if (out.length > maxLines) {
    out.length = maxLines;
    out[maxLines - 1] = out[maxLines - 1].replace(/\s*\S*$/, "") + "…";
  }
  return out.map((l) => l.replaceAll(" ", NBSP));
}
const oneRun = (text: string) => text.replaceAll(" ", NBSP);

const label = { fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 1.2, textTransform: "uppercase" as const, color: T.muted };

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: T.bg, padding: 40, fontFamily: "Geist", color: T.text }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `1px solid ${T.hairline}`, padding: "44px 56px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 500, letterSpacing: -0.3 }}>
            <div style={{ width: 16, height: 16, border: `2px solid ${T.text}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 6, height: 6, background: T.text }} />
            </div>
            {oneRun("context labs")}
          </div>
          <div style={label}>context-labs.net</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Badge({ type }: { type: Entry["type"] }) {
  const base = { display: "flex", fontFamily: "Geist Mono", fontSize: 20, fontWeight: 500, letterSpacing: 1.2, padding: "6px 18px" };
  if (type === "context") return <div style={{ ...base, border: `1.5px solid ${T.text}` }}>CONTEXT</div>;
  const filled = { ...base, background: T.text, color: T.bg };
  if (type === "skill") return <div style={filled}>SKILL</div>;
  // kit: filled + an outline 3px out
  return (
    <div style={{ display: "flex", padding: 3, border: `1.5px solid ${T.text}` }}>
      <div style={filled}>KIT</div>
    </div>
  );
}

export function entryImage(e: Entry) {
  const lines = e.preview.slice(0, 3).map((l) => parseLine(l, "card"));
  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 36 }}>
          <Badge type={e.type} />
          {/* the card's hover arrow, in accent */}
          <svg width="26" height="26" viewBox="0 0 14 14" fill="none" stroke={T.accent} strokeWidth="1.5">
            <path d="M1 13L13 1M3.5 1H13V10.5" />
          </svg>
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 68, fontWeight: 500, letterSpacing: -1.4, lineHeight: 1.05 }}>{oneRun(e.title)}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 14, fontSize: 28, lineHeight: 1.4, color: T.muted }}>
          {wrap(e.desc, 62, 2).map((l, i) => (
            <div key={i} style={{ display: "flex" }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 22, position: "relative", fontFamily: "Geist Mono", fontSize: 21 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "pre", overflow: "hidden", color: l.bright ? T.text : T.muted, height: 30 }}>
              {/* ✓ / ✕ drawn as SVG, as on the site: Geist Mono has no glyphs for them */}
              {l.mark === "x" && (
                <svg width="14" height="14" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M1 1l7 7M8 1L1 8" />
                </svg>
              )}
              {l.mark === "ok" && (
                <svg width="15" height="14" viewBox="0 0 10 9" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M1 4.8L3.8 7.6L9 1.2" />
                </svg>
              )}
              {l.text}
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", background: `linear-gradient(to bottom, rgba(14,15,16,0) 25%, ${T.bg} 100%)` }} />
        </div>
        <div style={{ ...label, display: "flex", marginTop: "auto" }}>{oneRun(`${e.author} · ${e.handle} · ${e.tools.join(" · ")}`)}</div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: fonts() },
  );
}

export function homeImage(meta: string) {
  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", fontSize: 96, fontWeight: 500, letterSpacing: -2, lineHeight: 1.05 }}>
          <div style={{ display: "flex" }}>{oneRun("the context behind")}</div>
          <div style={{ display: "flex" }}>{oneRun("good ai work.")}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 28, lineHeight: 1.45, color: T.muted }}>
          {wrap("context files and skills from people who build. take one, install it, stop getting generic output.", 60, 2).map((l, i) => (
            <div key={i} style={{ display: "flex" }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ ...label, display: "flex", marginTop: 28 }}>{oneRun(meta)}</div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: fonts() },
  );
}
