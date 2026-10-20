# Handoff · Claude Code (plan mode) · whole site
Date: 2026-10-20 · Source: CONTEXT.md (2026-10-20)

```
Read CONTEXT.md first. It is the source of truth; this prompt only scopes the build.

GOAL
Build context-labs.net from the approved Claude Design export: a static Next.js
site that launches as a waitlist and flips to the live library with one env var.

SCOPE
Plan all six phases now, then build one phase at a time and stop for my review after each:
1. Foundation: Next.js App Router + TypeScript + Tailwind on Vercel. Tokens, Geist /
   Geist Mono via next/font, grain overlay, CLTopBar (incl. mobile menu overlay),
   CLFooter, Vercel Analytics.
2. Content: loader for /content/<type>/<slug>/ markdown with a typed frontmatter
   schema (incl. draft). Real entries: kit `context-labs` + skills `setup`, `handoff`,
   `review`. Every other entry in the export goes in as draft: true. Download the three
   v0.1.0 release zips (gh release download v0.1.0 -R KhalerdAmeen/context-labs) into
   /content/kits/context-labs/files/.
3. Home: / reads NEXT_PUBLIC_WAITLIST. true → waitlist home; false → library (type +
   tool filters, drawer grid, kits span 2, "your context here" tile, empty-filter state).
4. Entry pages: /kits/[slug], /skills/[slug], /context/[slug]. Per-type section sets,
   install tabs, sticky rail (desktop) / sticky download bar (mobile), "what's inside"
   file viewer, related. Each skill page links back to /kits/context-labs.
5. Downloads: email pop-up on "download .zip" → server route (Loops upsert + transactional
   send) → signed /api/file route.
6. /about, /submit (Tally embed + the "what gets accepted" aside), 404.
Out of scope: accounts, search, comments, ratings, payments, the export's hand-built submit form.

DESIGN (approved, don't re-decide)
- Export: design/*.dc.html. Open them in a browser; every frame is live. Boards at
  1440 · 1280 · 768 · 390: "design/Pass 1 - Home.dc.html", "design/Entry Pages.dc.html",
  "design/Site Pages.dc.html". Screens: ContextLabsHome, WaitlistHome, EntryPage
  (slug kit/skill/context), AboutPage, SubmitPage, SystemStates. Components: CLTopBar,
  CLCard, CLCodePanel, CLFooter. Close-ups: design/shots/.
- The inline styles and renderVals() in each file are the spec (values, breakpoints,
  per-breakpoint sizes, hover and focus states). Port them; don't eyeball.
- Where CONTEXT.md overrides the export, CONTEXT.md wins:
  - Claude Code install tab (kit + skill pages): two commands, each with a copy button:
    /plugin marketplace add KhalerdAmeen/context-labs
    /plugin install context-labs@context-labs
    (not "unzip into ~/.claude/skills/").
  - Claude app tab: "Settings → Features → Skills → upload the .zip" (not "Capabilities").
  - "download .zip" opens the email pop-up; the export's inline "downloading <file>" state goes.
  - /submit embeds Tally instead of the hand-built form.
  - The export's "context" skill is `setup`.
  - Counters ("12 entries · 2 kits", "opening with 12 entries") are computed from
    published entries, never hardcoded.

CONSTRAINTS
- Tokens live in one theme file; no raw hex, rgba or px spacing in components.
- Zero border-radius everywhere. Accent #FF5B1F only on primary buttons, active
  filter/tab underline, focus ring, hover arrow.
- 1px hairline grid; touch targets ≥ 44px; focus ring 2px #FF5B1F; prefers-reduced-motion → no transitions.
- Pages are static; only the download routes run on the server.
- draft: true is hidden in production builds (lists and routes) and visible in dev.
- Zips live only in /content/kits/context-labs/files/: never /public, never served
  without a valid signed link. /api/file accepts only filenames from that folder (no path
  traversal), verifies signature + 7-day expiry, compares in constant time.
- Loops: upsert the contact (source = entry slug, subscribed = opt-in, unticked by
  default), then send transactional LOOPS_TRANSACTIONAL_ID with data variable downloadUrl.
- The Loops key and the signing secret are server-only Vercel env vars: never
  NEXT_PUBLIC_, never in code. Add .env.example with names only.
- Claude Code commands, "copy file", "download .md" and "copy context template" never ask for email.

FLAG IN THE PLAN (CONTEXT.md doesn't answer these; propose, don't decide)
- The release has three zips, one per skill: context-labs-setup.zip,
  context-labs-handoff.zip, context-labs-review.zip. No kit bundle. What does the kit
  page's "download .zip" deliver, given one downloadUrl per email?
- The email pop-up and its "check your inbox" state aren't in the export. Propose one
  from existing pieces (the "what you'll see" question card is the closest pattern).
- Where the waitlist email goes (Loops? which source value?).
- While NEXT_PUBLIC_WAITLIST=true, are entry pages and downloads reachable?
- Where "what's inside" file contents come from (the zips at build time, or /content).
- The Tally form id.

ACCEPTANCE
- NEXT_PUBLIC_WAITLIST=true renders the waitlist home; false renders the library. No code change between them.
- A production build lists exactly 4 entries: context-labs (kit), setup, handoff, review.
  Dev also shows the drafts.
- Type × tool filters work; an empty combination shows "nothing here yet." + "submit the first one".
- Copy buttons copy the exact commands and show "copied" for 2s.
- Download: email submitted → contact in Loops → email arrives → link downloads the
  right zip. The same link fails once expired or tampered; a direct request for a zip path 404s.
- Each page matches its board at 1440, 768 and 390: sharp corners, hairline grid, grain
  visible, accent only in the allowed places.
- An unknown URL shows "drawer not found".

VERIFY
- Add and run type-check (tsc --noEmit), lint and next build. All must be clean.
- Unit-test the signed-link helper: valid, expired, tampered, path traversal.
- Browser screenshots of every page at 1440, 768 and 390, next to the matching board.

PLAN FIRST. Don't write code until I approve the plan. Flag anything in the design that
conflicts with CONTEXT.md, the data model or Next.js. Build one phase at a time and stop
after each for review.
After building, run: update my context
```
