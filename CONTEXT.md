# Context Labs — Context

> Read this before any design or build work on this project.
> Last updated: 2026-10-22 · Mode: update

## Product
- What it is: a free library of AI context files, skills and kits you can take, install and use. [you]
- Who it's for: people who build with AI tools (Claude Code, Claude app, Claude Design, Cursor) and keep getting generic output. [you]
- Core action: browse the grid → open a drawer → install it (copy a command, or download the .zip) in seconds. [doc: design/ContextLabsHome.dc.html]
- Author: Khalid · @khalerdameen. Licence: CC BY 4.0. [you]
- Three content types: **context** (one file — copy it or download .md), **skill** (.zip: SKILL.md + references), **kit** (.zip: SKILL.md + references + examples; spans 2 grid columns). [doc: design/EntryPage.dc.html]
- In scope now: library home, entry pages (kit/skill/context), /about, /submit, /privacy, system states (menu, 404, empty, expired/invalid download link). [doc: design/*] [code: app/]
- Out of scope: accounts, search, comments, ratings, payments. [you]

## Direction
- Feel: archival, precise, terminal. [doc: design/*] [you]
- References: technical docs, terminals and filing cabinets (entries are literally called "drawers"); Vercel/Geist typographic restraint. [doc: design/*]
- Nomenclature: every entry is a **drawer**. 404 = "drawer not found"; pre-launch cells = "drawer N — opens at launch". [doc: design/SystemStates.dc.html, design/WaitlistHome.dc.html]
- Refused defaults: the category (Smithery, cursor.directory) ships light themes, logo walls, rounded cards with soft shadows, gradient heroes and generic SaaS marketplace grids. Context Labs refuses all of these. [research]

## Design
### Tokens
| Role | Value | Where it's allowed | Source |
|---|---|---|---|
| Background | `#0E0F10` | page background only | [doc: design/*] |
| Surface | `#141517` | hover cards, code panels, try-it box, inputs-on-focus fill | [doc: design/*] |
| Text | `#EDEBE7` | all foreground text, borders of filled badges | [doc: design/*] |
| Muted | `#8C8A86` | meta, secondary text, inactive nav/filters | [doc: design/*] |
| Code-dim | `#B4B2AD` | non-highlighted code lines in CLCodePanel | [doc: design/CLCodePanel.dc.html] |
| Accent | `#FF5B1F` | primary buttons, active filter/tab underline, focus ring, hover arrow | [doc: design/*] |
| Hairline | `rgba(255,255,255,0.08)` | the grid: cell/section borders | [doc: design/*] |
| Edge | `rgba(255,255,255,0.2–0.24)` | inputs, tablists, dashed submit tile, nested panels | [doc: design/*] |

> In code the tokens live only in `app/globals.css` `@theme`; Tailwind's default colours, radii, text sizes and breakpoints are reset, so off-system values don't compile. Variants: `t:` ≥600, `d:` ≥1024, `wide:` ≥1284. `lib/tokens.ts` mirrors the values for OG images — change both together. [code: app/globals.css, lib/tokens.ts]

> Example content on real pages comes from a real run on the Cram test project (`~/Downloads/context-labs/tests/sandbox-cram/`), excerpted verbatim and labelled "from a real run · Cram, a study planner (test project)". Cram's `#FFC400` is sample app content, not a brand token. The export's `#C41E3A` / Reelhouse samples are not used. [you]

### Type
- Families: **Geist** (400/500/600) — headings, UI, body; **Geist Mono** (400/500) — labels, meta, counters, badges, code. Loaded with `next/font/google`; OG images use the Geist TTFs in `assets/fonts/` (OFL). [doc: design/*] [code: app/layout.tsx, lib/og.tsx]
- Scale: hero h1 72/64/44 (d/t/m) · page title 56/44/36 · section title 28/24/22 · card title 20 · body 15 · mono meta 12 (uppercase, +0.06em) · code 13/19 · nav 14. [doc: design/*]
- Letter-spacing: display −0.02em, headings −0.01em, mono labels +0.06em uppercase. Line-height 1.1 display, 1.5 body. [doc: design/*]

### Rules
- **Zero border-radius everywhere.** `border-radius:0` is explicit; corners are sharp. [doc: design/*]
- **One accent.** `#FF5B1F` only on: primary-action buttons, the active filter/tab underline, focus outlines, and the hover-reveal arrow. Never decorative, never a fill behind text. [doc: design/*]
- **Everything is a bordered cell on a 1px hairline grid** ("drawers"). Cards, sections and fact rows share borders; negative margins collapse the doubles. [doc: design/*]
- **Grain overlay:** SVG fractal noise, opacity 0.06, pointer-events none, z-index 50, over the whole page. [doc: design/*]
- Motion: `transform` + `background-color` 200ms ease-out; hover lifts the arrow `translate(4px,-4px)`; honour `prefers-reduced-motion` (→ none). [doc: design/*]
- Touch targets ≥ 44px. Focus ring: 2px solid `#FF5B1F`, offset 2px (−2px when inset). [doc: design/*] [rule]
- Breakpoints: desktop ≥1024, tablet ≥600, mobile <600. Outer margin 40/24/16; inner pad 24/24/20; grid cols 4/2/1 (kits span 2). [doc: design/*]
- Badges: context = outline box; skill = filled `#EDEBE7` with dark ink; kit = filled + 1px outline offset 2px. Mono, uppercase, 12px. [doc: design/*]
- Voice: lowercase, terse, declarative, no emoji; mono for system/meta lines. E.g. "the context behind good ai work." / "take one, install it, stop getting generic output." [doc: design/*]

### Components that set the look
- **TopBar** — sticky 64px bar; logo is a 10px square mark with a 4px centre dot + "context labs"; nav: browse / submit / about; mobile menu is a native `<dialog>`. `components/top-bar.tsx` [doc: design/CLTopBar.dc.html] [code]
- **Card** — the drawer: badge row, hover-reveal arrow, title, 3-line clamped description, mono code preview with a fade mask, author + tools footer; CSS-only hover via the registered `--cell-bg`. `components/card.tsx` [doc: design/CLCard.dc.html] [code]
- **CodePanel** — label bar + copy button, numbered mono lines, ✓/✕ glyphs, bright/dim line colouring, collapse / show-all. `components/entry/code-panel.tsx` [doc: design/CLCodePanel.dc.html] [code]
- **Footer** — mono line "context labs · made by khalid · submissions open · cc by 4.0" ("open soon" until the Tally id is set) + submit / privacy / x links. `components/footer.tsx` [doc: design/CLFooter.dc.html] [code]
- **DrawerState** — the 3×3 empty-drawer grid with the message in the centre cell; used by the 404 and the expired/invalid link pages. `components/drawer-state.tsx` [doc: design/SystemStates.dc.html] [code]

### Pages / IA
- `/` home — hero + counter, type filters (all/kits/skills/context) and tool filters (claude app/code/design), the drawer grid, and a dashed "your context here" submit tile. Pre-launch: the **waitlist** variant (email capture + locked drawers). [doc: design/ContextLabsHome.dc.html, design/WaitlistHome.dc.html]
- `/kits/<slug>` · `/skills/<slug>` · `/context/<slug>` — entry pages; section set differs by type (below). [doc: design/EntryPage.dc.html]
- `/about` — three inputs (prompt × context × skill), three levels (personal/project/task), the loop diagram, "who makes this". [doc: design/AboutPage.dc.html]
- `/submit` — an embedded **Tally** form (replaces the design's hand-built form) beside "what gets accepted"; "submissions open soon." until `NEXT_PUBLIC_TALLY_FORM_ID` is set. [you] [code: app/submit/page.tsx]
- `/privacy` — plain English: what's stored, why, unsubscribe or delete (DM @khalerdameen on X). [you] [code: app/privacy/page.tsx]
- `/link/expired|invalid/<slug>` — where a failed download link lands, with a button back to the entry. OG images: `opengraph-image.tsx` for home and each entry type, static at build. [code: app/link/, app/opengraph-image.tsx]
- Entry sections — kit: how it works / what you'll see / what you get / install / what's inside / keep it alive / related. skill: triggers / real-run examples (e.g. handoff's "what it writes") / install / what's inside / related. context: rules↔applied tabs / where to put it / generate it instead / related. [doc: design/EntryPage.dc.html]

## Install & distribution
- **Claude Code tab** — two commands, each with a copy button (replaces the design's "unzip into ~/.claude/skills/"): [you]
  - `/plugin marketplace add KhalerdAmeen/context-labs`
  - `/plugin install context-labs@context-labs`
- **Claude app tab** — "Settings → Features → Skills → upload the .zip". (The design says "Capabilities" — that is wrong.) [you]
- Claude Code commands **never** ask for an email. [you]

## Email & downloads
- Only the **.zip download** triggers an email pop-up. [you]
- Loops stores the contact and emails a **private download link that expires in 7 days**. [you]
- The pop-up has an optional, **unticked** "send me new kits" checkbox. [you]
- A context's "copy file" / "download .md" and a kit's "copy context template" do **not** ask for email (they aren't .zips). [you] [doc: design/EntryPage.dc.html]
- The pop-up remembers the email in localStorage (`context-labs:email`): a returning visitor gets the link without the form; "use a different email" forgets it. [code: components/entry/download.tsx]

## Build
- Stack: Next.js 16.4 (App Router, Cache Components + Partial Prefetching, Turbopack), React 19, TypeScript, Tailwind v4, zod + gray-matter; Loops over fetch; `@vercel/analytics`, `@vercel/firewall`; Vercel, Node 24. [you] [code: package.json, next.config.ts]
- Structure: `app/` routes (home, `kits|skills|context/[slug]`, about, submit, privacy, `link/[state]/[slug]`, `api/download|file|waitlist`, an `opengraph-image.tsx` per segment); `components/` (top-bar, footer, card, badge, drawer-state, `entry/*`, `home/*`); `lib/content/` (schema + loader); `lib/server/` (loops, signed-link, downloads, rate-limit, forms — `server-only`); `content/`; `scripts/`; `tests/` (vitest) and `tests/e2e/` (Playwright). [code]
- Conventions: every page is fully static — `export const ensureStatic = "navigation"` + `generateStaticParams`; unknown or draft slugs hit `notFound()`. Content is read synchronously at build and validated by zod; a broken reference or missing file fails the build. Client components only where there's interaction (filters, dialogs, tabs, copy). [code: app/kits/[slug]/page.tsx, lib/content/index.ts]
- Env vars (names only; values in Vercel): `NEXT_PUBLIC_WAITLIST`, `NEXT_PUBLIC_TALLY_FORM_ID`, `SITE_URL`, `LOOPS_API_KEY`, `LOOPS_TRANSACTIONAL_ID`, `LOOPS_LAUNCH_LIST_ID`, `DOWNLOAD_SIGNING_SECRET`. [code: .env.example]
- Content: static pages built from markdown in `/content/<type>/<slug>/`. Frontmatter carries `draft: boolean` — `draft: true` is hidden in production, visible in dev. [you]
- Analytics: Vercel Analytics (cookieless). [you]
- Launch gating: env var **`NEXT_PUBLIC_WAITLIST`** — `true` or unset → waitlist home, `false` → live library. Inlined at build: flip it, then redeploy Production. [you] [code: lib/site.ts]
- Repos: this is the **website** repo; the Claude Code plugin marketplace + skill source live separately in `KhalerdAmeen/context-labs`. [you]
- Secrets (Loops API key, `LOOPS_TRANSACTIONAL_ID`, etc.) live **only in Vercel env vars** — never in code or in CONTEXT.md. [you]
- Rate limiting: **one** Vercel Firewall rule (Hobby allows one), a `@vercel/firewall` rule with rate-limit ID **`download`**, per IP, shared by `/api/download` and `/api/waitlist`. [you]

### Zip artifacts
- The three release `.zip`s come from `github.com/KhalerdAmeen/context-labs/releases` (v0.1.0), copied into **`/content/kits/context-labs/files/`** in this repo. [you]
- **Never** put them in `/public`. They are served only through the signed **`/api/file`** link. [you]
- On each new release run `npm run sync:release -- <tag>`: it downloads the zips, unpacks each skill's files into `content/skills/<slug>/files/` (for "what's inside") and rebundles the kit; then bump the kit's "version" fact. [you] [code: scripts/sync-release.mjs]
- `context-labs-kit.zip` is the three skill zips zipped together (the Claude app takes one .zip per skill), rebuilt byte-identically before every build. [you] [code: scripts/bundle-kit.mjs]

### Download flow (.zip)
1. "download .zip" opens the email pop-up. [you]
2. Loops **upserts the contact** (`source` = entry slug, `subscribed` = the "new kits" opt-in). [you]
3. Loops sends a **transactional email** (`LOOPS_TRANSACTIONAL_ID`) whose data variable **`downloadUrl`** is the signed `/api/file` link — private, expires in 7 days. [you]

### Commands
- `npm run dev` — local dev; `NEXT_PUBLIC_WAITLIST=false` shows the library, drafts are visible, and without Loops keys `/api/download` logs the signed link instead of emailing. [code: package.json, app/api/download/route.ts]
- `npm run build` — bundles the kit zip, then `next build`. [code: package.json]
- `npm run typecheck` (`next typegen` + `tsc`) · `npm run lint` · `npm test` (vitest) · `npm run test:e2e` (Playwright on `next dev` :3300). [code: package.json, playwright.config.ts]
- Ship: push a branch → Vercel preview; merge to `main` → Production. [you]

### Rules that have bitten before
**Vercel**
- Env var changes only reach deployments built after the change — after editing them, redeploy the right target (Preview vs Production). A redeploy of a Production deployment rebuilds `main`, not the branch preview. [you]
- The project was created when the repo held only the static design export, so every Next.js deploy failed until `vercel.json` pinned `"framework": "nextjs"`. Keep it. [code: vercel.json]
- Hobby keeps runtime logs for about 30 minutes — run `vercel logs --deployment …` right after reproducing. [research]
- Files a route handler reads at runtime must be listed in `outputFileTracingIncludes` (the content index and zips for `/api/download` and `/api/file`), or they're missing on Vercel. [code: next.config.ts]

**Next.js 16 · Cache Components**
- There's no `dynamicParams` — use `ensureStatic = "navigation"` + `notFound()` for unknown slugs. [code: app/kits/[slug]/page.tsx]
- Async `fs` reads count as uncached data and make a route dynamic — read content and OG fonts with sync `fs`. [code: lib/content/index.ts, lib/og.tsx]
- `PageProps<"/route">` types come from `next typegen`; `npm run typecheck` runs it first. [code: package.json]

**Loops**
- New contacts are subscribed by default, and `subscribed: false` unsubscribes an existing contact — look the contact up first; an unticked "new kits" box only sets `subscribed` on new contacts. [code: lib/server/loops.ts]

**Content · Tailwind · OG**
- An unquoted comma inside a YAML `{ … }` splits the value into a stray key — small schema objects are `.strict()`, so the build fails instead of silently truncating. [code: lib/content/schema.ts]
- Tailwind only generates class names it finds literally — never build them with template strings. [code: lib/grid.ts]
- Satori draws a gap after kerned words in Geist ("context ") — OG text is wrapped by hand with no-break spaces, and ✓/✕ are SVG (Geist Mono has no glyphs for them). [code: lib/og.tsx]

### Known issues
- `next dev` shows an "instant navigation" notice on entry pages (`params` read outside Suspense). Dev only; builds are fully static. [code: app/skills/[slug]/page.tsx]
- The nine export placeholders are still `draft: true` (dev only) until real entries replace them. [code: content/]

## Launch
- Status: **live in waitlist mode** at context-labs.net — Production = `main` @ `2044895`, deployed 2026-10-22; `www` 308s to the apex; Tally embedded. To open the library: set `NEXT_PUBLIC_WAITLIST=false`, redeploy Production. [research] [you]
- Real content at launch: the **Context Labs kit** (the `context-labs` plugin) and its three skills — **setup**, **handoff**, **review**. The design's "context" entry = **setup** (renamed). [you]
- Also real at launch: one context entry, **iOS & Android App Review rules** (`/context/app-review-rules`), a verbatim copy of the setup skill's `references/mobile-rules.md`, credited to Khalid. [you]
- Pages: the kit gets its own page, and setup, handoff and review each get their own **skill page that links back to the kit**. [you]
- Everything else in the export (Mobile App Kit, Website Kit, Deterministic Motion, About Me, iOS App Review, Claude Design Pass Plan, Pitch Deck, Brand Identity, Plan Mode Prompt) ships as **placeholder, `draft: true`** so the layout works; real ones come later. [you]
- Promises we can prove: free; CC BY 4.0; works with Claude Code / Claude app / Claude Design / Cursor. Entry counts are computed from published entries (today "5 entries · 1 kit"), never hardcoded. [you] [code: app/page.tsx]

## Decisions log
- 2026-10-20: Waitlist-first launch; a flag flips the site to the live library. [you]
- 2026-10-20: Only the Context Labs kit (setup, handoff, review) is real; all other entries ship as `draft: true`. Design's "context" = setup. [you]
- 2026-10-20: Install = plugin marketplace commands, not unzip-to-`~/.claude/skills`. [you]
- 2026-10-20: Claude app path is Settings → Features → Skills (design's "Capabilities" is wrong). [you]
- 2026-10-20: Only .zip downloads gate on email, via Loops (7-day private link, optional unticked "new kits" opt-in). [you]
- 2026-10-20: /submit uses an embedded Tally form, replacing the design's custom form. [you]
- 2026-10-20: Vercel Analytics; website and plugin marketplace are two separate repos. [you]
- 2026-10-20: Launch flag is `NEXT_PUBLIC_WAITLIST` (true = waitlist, false = live library). [you]
- 2026-10-20: Release zips are copied from the `KhalerdAmeen/context-labs` v0.1.0 releases into `/content/kits/context-labs/files/`, never `/public`, served only via the signed `/api/file` link; re-copied each release. [you]
- 2026-10-20: setup, handoff and review each get their own skill page linking back to the kit. [you]
- 2026-10-20: Download flow = Loops upsert contact (source=slug, subscribed=opt-in) → transactional email `LOOPS_TRANSACTIONAL_ID` with `downloadUrl` data variable (signed, 7-day). [you]

- 2026-10-20: Example panels and previews use verbatim excerpts from the Cram test run, labelled as such; the export's illustrated examples, Reelhouse and `#C41E3A` are removed. [you]
- 2026-10-20: The home page shows the waitlist unless `NEXT_PUBLIC_WAITLIST` is explicitly `false`; a missing variable never launches the library. [you]
- 2026-10-20: Form errors use a text-colour bar, not the export's accent bar (accent stays on its four allowed uses). [you]
- 2026-10-20: Publish "iOS & Android App Review rules" (context, not a draft) from setup's `mobile-rules.md`; the Context filter stays. [you]
- 2026-10-22: An expired or invalid download link lands on a styled page (the "drawer not found" layout) with a button back to that entry's page. [you]
- 2026-10-22: A repeat download request for the same email + entry within 10 minutes doesn't send a second email. [you]
- 2026-10-22: Primary domain is `context-labs.net` (no www); `SITE_URL` = `https://context-labs.net`. [you]
- 2026-10-22: One Firewall rate-limit rule (`download`) covers both email forms — Vercel Hobby allows one rule. [you]
- 2026-10-22: Reelhouse in the About bio is Khalid's real project and stays; only the export's Reelhouse *sample data* is excluded. [you]
- 2026-10-22: Data deletion: DM @khalerdameen on X (stated on /privacy next to unsubscribe). [you]
- 2026-10-22: Site built in six phases and merged to `main` (PRs #1, #2); Production redeployed with the current env vars. [you]
- 2026-10-22: Tally form embedded on /submit; its theme is set to dark in Tally. [you]

## Open questions
- None open. (Raise new ones here as they come up.)
