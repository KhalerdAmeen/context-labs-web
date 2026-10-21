# Context Labs — Context

> Read this before any design or build work on this project.
> Last updated: 2026-10-20 · Mode: create

## Product
- What it is: a free library of AI context files, skills and kits you can take, install and use. [you]
- Who it's for: people who build with AI tools (Claude Code, Claude app, Claude Design, Cursor) and keep getting generic output. [you]
- Core action: browse the grid → open a drawer → install it (copy a command, or download the .zip) in seconds. [doc: design/ContextLabsHome.dc.html]
- Author: Khalid · @khalerdameen. Licence: CC BY 4.0. [you]
- Three content types: **context** (one file — copy it or download .md), **skill** (.zip: SKILL.md + references), **kit** (.zip: SKILL.md + references + examples; spans 2 grid columns). [doc: design/EntryPage.dc.html]
- In scope now: library home, entry pages (kit/skill/context), /about, /submit, system states (menu, 404, empty). [doc: design/*]
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

> Example content on real pages comes from a real run on the Cram test project (`~/Downloads/context-labs/tests/sandbox-cram/`), excerpted verbatim and labelled "from a real run · Cram, a study planner (test project)". Cram's `#FFC400` is sample app content, not a brand token. The export's `#C41E3A` / Reelhouse samples are not used. [you]

### Type
- Families: **Geist** (400/500/600) — headings, UI, body; **Geist Mono** (400/500) — labels, meta, counters, badges, code. Loaded from Google Fonts in the export; use `next/font`. [doc: design/*] [you]
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
- **CLTopBar** — sticky 64px bar; logo is a 10px square mark with a 4px centre dot + "context labs"; nav: browse / submit / about. [doc: design/CLTopBar.dc.html]
- **CLCard** — the drawer: badge row, hover-reveal arrow, title, 3-line clamped description, mono code preview with a fade mask, author + tools footer. [doc: design/CLCard.dc.html]
- **CLCodePanel** — label bar + copy button, numbered mono lines, ✓/✕ glyphs, bright/dim line colouring, collapse / show-all. [doc: design/CLCodePanel.dc.html]
- **CLFooter** — mono line "context labs · made by khalid · submissions open · cc by 4.0" + submit / x links. [doc: design/CLFooter.dc.html]

### Pages / IA
- `/` home — hero + counter, type filters (all/kits/skills/context) and tool filters (claude app/code/design), the drawer grid, and a dashed "your context here" submit tile. Pre-launch: the **waitlist** variant (email capture + locked drawers). [doc: design/ContextLabsHome.dc.html, design/WaitlistHome.dc.html]
- `/kits/<slug>` · `/skills/<slug>` · `/context/<slug>` — entry pages; section set differs by type (below). [doc: design/EntryPage.dc.html]
- `/about` — three inputs (prompt × context × skill), three levels (personal/project/task), the loop diagram, "who makes this". [doc: design/AboutPage.dc.html]
- `/submit` — an embedded **Tally** form (replaces the design's hand-built form). [you]
- Entry sections — kit: how it works / what you'll see / what you get / install / what's inside / keep it alive / related. skill: triggers / one context three prompts / install / what's inside / related. context: rules↔applied tabs / where to put it / generate it instead / related. [doc: design/EntryPage.dc.html]

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

## Build
Pending — no code yet. Decided stack and conventions:
- Stack: Next.js (App Router) + TypeScript + Tailwind, hosted on Vercel. [you]
- Content: static pages built from markdown in `/content/<type>/<slug>/`. Frontmatter carries `draft: boolean` — `draft: true` is hidden in production, visible in dev. [you]
- Analytics: Vercel Analytics (cookieless). [you]
- Launch gating: env var **`NEXT_PUBLIC_WAITLIST`** — `true` → waitlist home, `false` → live library. Ship waitlist first, flip to go live. [you]
- Repos: this is the **website** repo; the Claude Code plugin marketplace + skill source live separately in `KhalerdAmeen/context-labs`. [you]
- Secrets (Loops API key, `LOOPS_TRANSACTIONAL_ID`, etc.) live **only in Vercel env vars** — never in code or in CONTEXT.md. [you]
- Rate limiting: **one** Vercel Firewall rule (Hobby allows one), a `@vercel/firewall` rule with rate-limit ID **`download`**, per IP, shared by `/api/download` and `/api/waitlist`. [you]

### Zip artifacts
- The three release `.zip`s come from `github.com/KhalerdAmeen/context-labs/releases` (v0.1.0), copied into **`/content/kits/context-labs/files/`** in this repo. [you]
- **Never** put them in `/public`. They are served only through the signed **`/api/file`** link. [you]
- Khalid re-copies the zips into that folder on each new release. [you]

### Download flow (.zip)
1. "download .zip" opens the email pop-up. [you]
2. Loops **upserts the contact** (`source` = entry slug, `subscribed` = the "new kits" opt-in). [you]
3. Loops sends a **transactional email** (`LOOPS_TRANSACTIONAL_ID`) whose data variable **`downloadUrl`** is the signed `/api/file` link — private, expires in 7 days. [you]

### Rules that have bitten before
- **Vercel:** env var changes only reach deployments built after the change — after editing them, redeploy the right target (Preview vs Production). A redeploy of a Production deployment rebuilds `main`, not the branch preview. [you]

### Known issues
- n/a — no code yet.

## Launch
- Status: building. Deploy waitlist first; flip to live later. [you]
- Real content at launch: the **Context Labs kit** (the `context-labs` plugin) and its three skills — **setup**, **handoff**, **review**. The design's "context" entry = **setup** (renamed). [you]
- Also real at launch: one context entry, **iOS & Android App Review rules** (`/context/app-review-rules`), a verbatim copy of the setup skill's `references/mobile-rules.md`, credited to Khalid. [you]
- Pages: the kit gets its own page, and setup, handoff and review each get their own **skill page that links back to the kit**. [you]
- Everything else in the export (Mobile App Kit, Website Kit, Deterministic Motion, About Me, iOS App Review, Claude Design Pass Plan, Pitch Deck, Brand Identity, Plan Mode Prompt) ships as **placeholder, `draft: true`** so the layout works; real ones come later. [you]
- Promises we can prove: free; CC BY 4.0; works with Claude Code / Claude app / Claude Design / Cursor. Do **not** claim entry counts until they're real — the design's "12 entries · 2 kits" is placeholder. [you]

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

## Open questions
- None open. (Raise new ones here as they come up.)
