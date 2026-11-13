# Context Labs (context-labs.net) — Handoff

> Written 2026-11-13 for the move to a new tool. Read this first, then `CONTEXT.md` (the project's
> source of truth: design tokens, rules, decisions log, "rules that have bitten before").

## What this is

A free library of AI context files, skills and kits by Khalid (@khalerdameen), CC BY 4.0. A static
Next.js site on Vercel: browse "drawers", install with two `/plugin` commands, or download a `.zip`
through an email-gated, signed 7-day link. Pre-launch it shows a waitlist home.

## Where things stand (checked 2026-11-13)

- **Live:** context-labs.net (apex is primary; `www` 308s to it) serves `main` @ `b35476f`,
  Vercel deployment `dpl_D4juWM3sBs3XS6mRjWW2VZLJ9QbL`, Ready. Home is in **waitlist mode**.
- **GitHub:** `KhalerdAmeen/context-labs-web` (**public** — no secrets are in it; make it private in GitHub settings if you prefer). Everything is merged to `main` via PRs #1–#5
  (squash). The skills/plugin source lives in a separate repo, `KhalerdAmeen/context-labs`.
- **Vercel:** team `khalerdameens-projects`, project `context-labs-web` (Hobby plan). All 7 env vars
  set for Production + Preview. Firewall rule `download` (rate-limit API ID, 5 requests / 60s) is enabled.
- **Last verified end to end:** the download email + signed link, on a preview, 2026-10-21. The new
  branded template (3 variables) went live 2026-10-23; no download was attempted in the 30 minutes
  watched after that deploy, so it is **not yet verified in production** — see "What's left" #1.

## What's built

| Area | What | Where |
|---|---|---|
| Home | Waitlist (email → Loops "Launch" list, locked drawers) or library (type × tool filters in the URL, drawer grid, submit tile, empty state); flips on `NEXT_PUBLIC_WAITLIST` | `app/page.tsx`, `components/home/` |
| Entry pages | Kit / skill / context pages: header, sticky rail, install tabs (copy buttons), "what's inside" file viewer, real-run examples, related, mobile download bar | `app/{kits,skills,context}/[slug]/`, `components/entry/` |
| Downloads | Email pop-up (remembers the email) → `/api/download` (Loops contact + transactional email with `downloadUrl`, `fileName`, `nextStep`) → `/api/file` (HMAC-signed, 7-day, allowlisted zips; failures go to styled `/link/expired|invalid/<slug>`) | `components/entry/download.tsx`, `app/api/`, `lib/server/` |
| Pages | `/about` (loop diagram), `/submit` (Tally embed), `/privacy`, 404 "drawer not found" | `app/` |
| OG images | Static per-entry and home images built from the card design | `lib/og.tsx`, `app/**/opengraph-image.tsx` |
| Content | Published: Context Labs kit + setup, handoff, review + "iOS & Android App Review rules". 9 export placeholders as `draft: true` (dev only) | `content/` |
| Email | Branded Loops transactional email (MJML), zipped for upload | `emails/download/`, `scripts/email.mjs` |
| Quality | 47 unit tests (vitest), 39 Playwright tests (7 desktop + 32 mobile at 320/375/390/430). Lighthouse mobile: performance 97–100, accessibility 100 | `tests/`, `tests/e2e/` |

## What's left (in order)

1. **Verify the live download email** with the new template: download a .zip on context-labs.net,
   then within 30 minutes (Hobby log retention) run
   `vercel logs --project context-labs-web --scope khalerdameens-projects --since 30m`.
   The Loops template must expect exactly `downloadUrl`, `fileName`, `nextStep` (it does, per Khalid, 2026-10-23).
2. **Launch the library:** set `NEXT_PUBLIC_WAITLIST=false` in Vercel, then redeploy **Production**
   (the value is built into the pages).
3. **Real entries:** replace or delete the 9 `draft: true` placeholders in `content/`.
4. **Refresh `CONTEXT.md`:** its Launch line still says `main @ 2044895`; it predates the email
   template + 3 variables, the 16px mobile-field rule and the firewall rule being created.
5. **New plugin release:** `npm run sync:release -- vX.Y.Z`, then bump the kit's "version" fact in
   `content/kits/context-labs/index.md`.
6. Optional: tidy the dev-only "instant navigation" notice on entry pages; upgrade the Vercel CLI
   (65.0 → latest); delete merged `KhalerdAmeen/*` branches on GitHub.

## Next steps for a new session

- `npm install`, then `NEXT_PUBLIC_WAITLIST=false npm run dev` (drafts visible; without Loops keys
  `/api/download` logs the signed link instead of emailing).
- Before shipping: `npm run typecheck && npm run lint && npm test && npm run build`; for UI changes
  also `npm run test:e2e`.
- Ship: branch off `main` → PR (Vercel builds a preview) → squash-merge → Production deploys `main`.

## Key decisions (full list: `CONTEXT.md` → Decisions log)

- Waitlist first; only an explicit `NEXT_PUBLIC_WAITLIST=false` shows the library.
- Install = `/plugin marketplace add KhalerdAmeen/context-labs` + `/plugin install context-labs@context-labs`;
  Claude app path is **Settings → Features → Skills** (the design's "Capabilities" is wrong).
- Only `.zip` downloads ask for an email; Loops stores it and sends a private 7-day link; the
  "send me new kits" box starts unticked. Same email + entry within 10 minutes = one email.
- Zips live in `content/kits/context-labs/files/`, never `/public`; served only via signed `/api/file`.
- The kit zip is the three skill zips zipped together (the Claude app takes one .zip per skill).
- One accent (`#FF5B1F`), zero radius, hairline grid, Geist / Geist Mono; tokens only in `app/globals.css`.
- Examples on real pages are verbatim excerpts from the Cram test project, labelled as such.
- Primary domain `context-labs.net`; one Firewall rate-limit rule (`download`) for both email forms.
- Data deletion: DM @khalerdameen on X (stated on /privacy).

## Gotchas (full list: `CONTEXT.md` → Rules that have bitten before)

- **Vercel env vars** only reach deployments built after the change; redeploy the right target.
  Redeploying a Production deployment rebuilds `main`, not a branch preview.
- **`vercel.json` pins `"framework": "nextjs"`** — the project was created as a static site; keep it.
- **Loops:** new contacts are subscribed by default and `subscribed: false` unsubscribes — the code
  looks contacts up first. The Loops template and `/api/download` must agree on data variables;
  change them together (deploy code, then template, or vice versa, in one sitting).
- **iOS Safari zooms** when a focused field is under 16px — form fields are 16px below `t:`.
- **Next 16 / Cache Components:** no `dynamicParams`; async `fs` reads make routes dynamic (content
  and OG fonts are read synchronously); route types need `next typegen` (built into `npm run typecheck`).
- **Runtime files** read by route handlers must be in `outputFileTracingIncludes` (`next.config.ts`).
- **Two dev servers** need separate build folders (`NEXT_DIST_DIR=.next-waitlist` for the e2e
  waitlist server); `next dev` then adds that folder to `tsconfig.json` — leave it.
- **Satori (OG):** kerned Geist words get a gap — OG text is wrapped by hand with no-break spaces.
- **YAML:** an unquoted comma in `{ … }` splits a value; small schema objects are `.strict()`.
- **Vercel CLI token** in `~/Library/Application Support/com.vercel.cli/auth.json` rotates; prefer
  `vercel …` commands over raw API calls with that token.
- **Squash merges** leave feature branches behind `main`; always branch off fresh `main`.

## Environment & services (names only — values live in Vercel)

`NEXT_PUBLIC_WAITLIST`, `NEXT_PUBLIC_TALLY_FORM_ID`, `SITE_URL`, `LOOPS_API_KEY`,
`LOOPS_TRANSACTIONAL_ID`, `LOOPS_LAUNCH_LIST_ID`, `DOWNLOAD_SIGNING_SECRET` (see `.env.example`).
Services: Vercel (hosting, Analytics, Firewall), Loops (contacts, "Launch" list, download email),
Tally (submission form, dark theme), GitHub. No secret files are in the repo; `.env*` is gitignored.

## Non-code files (designs, emails, docs)

| File / folder | What it is |
|---|---|
| `design/` | The approved Claude Design export: 13 `.dc.html` screens, components and boards (+ `support.js` runtime) |
| `design/shots/` | 5 reference screenshots from the design |
| `CONTEXT.md` | Project context: product, direction, tokens, rules, build notes, decisions log |
| `CLAUDE.md`, `AGENTS.md` | Load CONTEXT.md and Next's agent rules into Claude Code sessions |
| `HANDOFF.md` | This file |
| `.context-labs/handoffs/2026-10-20-claude-code-whole-site.md` | The plan-mode prompt the site was built from |
| `content/` | All entry markdown, skill files ("what's inside") and the release zips |
| `emails/download/index.mjml` (+ `img/`, empty) | Branded Loops download email; `npm run email:zip` → `emails/download.zip`, `npm run email:preview` → preview HTML (both gitignored) |
| `assets/fonts/` | Geist / Geist Mono TTFs + OFL licence, used by the OG images |
| `assets/plans/2026-10-20-build-plan.md` | The approved six-phase build plan (copied from `~/.claude/plans/`) |
| `assets/claude-memory/` | Claude Code memory notes for this project (copied from `~/.claude/projects/…/memory/`) |
| `.env.example` | Env var names, Firewall rule note |
| `.context/` (local only, gitignored) | Conductor scratch: review screenshots (26 MB), Lighthouse reports, one-off QA scripts. Not in git; copy it by hand if you want it |

External reference, not copied: the Cram test project at `~/Downloads/context-labs/tests/sandbox-cram/`
(Khalid's), the source of the verbatim example excerpts. Temporary scripts written to `/tmp` during
the build have been cleared by macOS; nothing in them was needed (the useful ones were also in `.context/`).
