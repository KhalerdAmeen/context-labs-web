# Plan: build context-labs.net (6 phases)

## Context
The repo holds only the approved Claude Design export (`design/`), `CONTEXT.md` (source of truth, loaded via `CLAUDE.md`) and the handoff prompt. This plan builds the whole site from that export. It's a static Next.js site on Vercel that ships as a waitlist and flips to the live library through `NEXT_PUBLIC_WAITLIST`. The only real content is the Context Labs kit (setup, handoff, review). Everything else ships as `draft: true`. I build one phase at a time and stop for your review after each.

The inline styles and `renderVals()` in each `design/*.dc.html` file are the spec. I port the values exactly, I don't redesign, and CONTEXT.md overrides the export where they disagree.

## Decisions folded in (yours, plus facts I checked)
- **Kit zip:** `scripts/bundle-kit.mjs` (uses `fflate`) packs the three skill zips unchanged into `context-labs-kit.zip`, in the same `files/` folder. The kit page delivers that file and each skill page delivers its own zip. The kit's Claude app tab says: "unzip it, then upload each of the three .zip files".
- **Release assets (checked):** v0.1.0 has `context-labs-setup.zip` (11.5 kb), `context-labs-handoff.zip` (5.7 kb) and `context-labs-review.zip` (4.9 kb).
- **"What's inside":** I copy each skill's files once into `/content/skills/<slug>/files/` and read them at build time; zips are never unpacked during the build. File lists per the local v0.1.0 plugin: setup = SKILL.md + where-to-look, questions, template, mobile-rules; handoff = SKILL.md + design, plan-mode, artifact; review = SKILL.md + fix-prompt, tells.
- **Release helper:** `npm run sync:release -- <tag>` runs `gh release download` into the kit's `files/` folder, unzips the skill files into `/content/skills/<slug>/files/` and re-bundles the kit. One command instead of re-copying by hand.
- **Waitlist:** Loops contact, `source: "waitlist"`, added to the "Launch" list. The Loops API needs the list **ID**, so this adds a new env var, `LOOPS_LAUNCH_LIST_ID`. No download; the form shows the design's "you're in." state.
- **While `NEXT_PUBLIC_WAITLIST=true`:** only `/` swaps to the waitlist. Entry pages and downloads stay reachable by direct link.
- **Tally:** reads `NEXT_PUBLIC_TALLY_FORM_ID`; while it's unset, /submit shows a "submissions open soon" state.
- **Loops subscription gotcha (checked in the Loops docs):** new contacts are *subscribed by default*, and `subscribed:false` *unsubscribes* an existing contact. So the routes first look the contact up (`GET /v1/contacts/find`):
  - **New contact:** create it with `subscribed` set to the opt-in value.
  - **Existing contact:** send `subscribed:true` only if the box was ticked, otherwise leave the field out. An unticked box never unsubscribes anyone.
  - **Source:** downloads set `source` to the entry slug. The waitlist sets `source` only when it creates the contact, so it never overwrites a download record.
- **Rate limit:** `@vercel/firewall` `checkRateLimit()`, per IP by default and available on Hobby. It needs one dashboard rule per ID (`download`, `waitlist`), which you create; see Manual setup. Locally it never limits.
- **Contrast (computed):** muted `#8C8A86` on `#0E0F10` is 5.6:1 and on `#141517` 5.3:1. Ink `#0E0F10` on the accent `#FF5B1F` is 6.2:1. All pass 4.5:1 with no token changes.

## Content model
- `/content/<type>/<slug>/index.md`: frontmatter validated by a **zod** schema in `lib/content/schema.ts`. Fields:
  - **Card:** type, title, desc, tools[], preview[] (the card's code lines), draft.
  - **Header:** tryIt, facts[], works[].
  - **Install:** per-type install tabs.
  - **Links:** related[].
  - **Per-type sections:**
    - kit: how[], question card, get-lines, `skills: [setup, handoff, review]`
    - skill: triggers[], examples[] (title + panels), `kit: context-labs`
    - context: rules[], applied[]
- `files/` next to each `index.md` holds the "what's inside" files (skills) or the copyable file (context entries). The kit's tree is built from its skills' `files/`, grouped `setup/`, `handoff/`, `review/`.
- Code panels show raw text lines (as the design does), so there's no markdown or MDX pipeline. Dependencies are `gray-matter` + `zod` only.
- `lib/content/index.ts`: `getEntries()` / `getEntry(type, slug)`. Drafts are filtered out when `NODE_ENV === 'production'`, which hides them on Vercel previews too and keeps `next build` honest. Counters and filters are derived from this list and never hardcoded.
- The skill page's section 02 generalises the design's "one context, three prompts". handoff keeps its three prompts, setup shows its question card plus the CONTEXT.md it writes, and review shows a ✓/✕ report plus its fix prompt.

## Phases (stop after each for review)

**1 · Foundation**
- `create-next-app` (latest, App Router, TS, Tailwind v4, ESLint, npm).
- `app/globals.css` `@theme` is the **only** token file: colours, hairline/edge, the type scale, breakpoints 600/1024, radius 0.
- Geist and Geist Mono through `next/font`.
- `components/`: `Grain` (the design's SVG data URI, opacity .06), `TopBar` (sticky 64px, active link, mobile menu overlay), `Footer` (adds a **privacy** link), `Frame` (outer margin 40/24/16 plus side hairlines).
- `<Analytics />` in `app/layout.tsx`; `.env.example` with variable names only.
- **Review:** the empty shell at 1440/768/390, plus the menu overlay.

**2 · Content**
- Schema, loader and the real entries (`kits/context-labs`, `skills/setup|handoff|review`).
- The 9 placeholders from the export, all `draft: true`.
- Release zips downloaded; skill files copied; `bundle-kit` wired in (`"build": "node scripts/bundle-kit.mjs && next build"`, so it can never go stale).
- I write the real kit and skill copy, adapted from the export's mobile-kit/handoff sample copy, and flag every claim for you, e.g. "~5 min", "~15 clicks".
- **Review:** the content files and the unit tests.

**3 · Home**
- `app/page.tsx` branches on `NEXT_PUBLIC_WAITLIST`. That value is inlined at build, so flipping it means changing the env var and redeploying — no code change.
- **Library:** hero + computed counter; type × tool filters (a client component; state in the URL query); `Card` (the CLCard port, with hover fade, arrow and reduced-motion handling); the kit spans 2 columns; the dashed "your context here" tile; filler cells; the empty-filter state.
- **Waitlist:** email form → `/api/waitlist`; published cards, then locked "drawer NN — opens at launch" cells.
- **Review:** both modes, filters, hover, the empty state.

**4 · Entry pages**
- `app/{kits,skills,context}/[slug]/page.tsx` with `generateStaticParams` and `dynamicParams = false`, so unknown slugs 404.
- `components/entry/`:
  - **Header:** crumbs, badge, meta and works-with chips. A skill page also gets a "part of the context labs kit →" link, and the kit comes first in its related list.
  - **Rail:** sticky on desktop; download bar on mobile.
  - **CodePanel:** the CLCodePanel port, with copy, collapse and ✓/✕ glyphs.
  - **InstallTabs:** a proper tablist; the Claude Code tab is the two commands with copy buttons ("copied" for 2s).
  - **FileTree:** a sidebar on wider screens, a dropdown on mobile.
  - **QuestionCard**, plus the per-type sections and related cards.
- Copy file / download .md / copy context template are client-side only and never ask for email.
- **Review:** kit, skill and context pages at the 3 widths.

**5 · Downloads**
- **`DownloadDialog`:** native `<dialog>` with `showModal()`, which makes the rest of the page inert, plus a focus loop. Esc closes it and focus goes back to the trigger. It's labelled with `aria-labelledby`/`aria-describedby` and built from the question-card pattern: email field, unticked "send me new kits", a privacy link, and a hidden honeypot field.
- **Returning visitor:** the email is remembered in `localStorage`. Next time the dialog skips the form, sends immediately and shows "check your inbox · sent to … · use a different email". `subscribed` isn't sent in that case.
- **`app/api/download/route.ts`** (Node runtime):
  1. Checks the rate limit.
  2. Validates with zod: `{slug, email, optIn, company}`; `company` is the honeypot.
  3. Maps the slug to a file on the server — the client never names a file.
  4. Runs the Loops find → create/update flow.
  5. Sends the transactional email with `downloadUrl` and an `Idempotency-Key` built from (email, slug, day).
  - A filled honeypot gets a fake 200. All failures return one generic message.
- **`app/api/file/route.ts`:**
  - Basename allowlist taken from the `files/` folder.
  - `exp > now` check; HMAC-SHA256 compared with `timingSafeEqual`.
  - Streams the file with `Content-Disposition: attachment` and `Cache-Control: private, no-store`.
  - `next.config.ts` `outputFileTracingIncludes` adds the zips to the deployed function, which they otherwise wouldn't be.
- `lib/signed-link.ts`: `sign()` / `verify()`, 7-day expiry, using `DOWNLOAD_SIGNING_SECRET` and `SITE_URL`.
- `app/api/waitlist/route.ts`: same rate limit, zod and honeypot pattern.
- **Review:** the dialog's closed, open, error and "check your inbox" states, plus a real email end to end.

**6 · Remaining pages, OG and quality**
- `/about`: the loop diagram as a grid on desktop and a list on mobile.
- `/submit`: Tally iframe via `next/script` `lazyOnload`, plus the "what gets accepted" aside and the "submissions open soon" fallback.
- `/privacy`: your plain-English text.
- `app/not-found.tsx`: "drawer not found" in a 3×3 grid.
- **OG images:** `opengraph-image.tsx` for home and for each entry route (`next/og`, rendered statically, laid out like the card). They use Geist TTFs committed in `assets/fonts/`, because Satori can't read woff2.
- Then a Lighthouse and contrast pass, fixing whatever comes up.
- **Review:** all pages, the OG images, the Lighthouse reports.

## Deviations from the export to sign off at review
1. The footer gains a "privacy" link, and the pop-up links to /privacy.
2. Skill → kit back-link placement (the export doesn't have one).
3. The download pop-up and its states (not in the export).
4. The kit's "what's inside" groups files by skill.
5. Kit facts such as "~5 min" and "~15 clicks" are unverified claims, so I need you to confirm or replace them.

## Manual setup (you, in the dashboards; no secrets in the repo)
- **Vercel env:** `LOOPS_API_KEY`, `LOOPS_TRANSACTIONAL_ID`, `LOOPS_LAUNCH_LIST_ID`, `DOWNLOAD_SIGNING_SECRET` (random, 32+ bytes), `SITE_URL=https://context-labs.net`, `NEXT_PUBLIC_WAITLIST`, `NEXT_PUBLIC_TALLY_FORM_ID`.
- **Vercel Firewall:** two `@vercel/firewall` rules with rate-limit IDs `download` and `waitlist`. I'll suggest 5 requests/min per IP.
- **Loops:** the transactional template using `{downloadUrl}`, and the "Launch" list (copy its ID into the env var).

## Verification
- `npm run typecheck` (`tsc --noEmit`), `npm run lint` and `npm run build`, all clean.
- **Vitest:**
  - Signed links: valid, expired, tampered, path traversal, unknown file.
  - Content schema plus the draft filter: a production build publishes exactly 4 entries.
  - zod and honeypot handling in `/api/download`.
  - The Loops subscribe logic: new contact unticked → `false`; existing contact unticked → field left out.
- **Playwright:**
  - The dialog: focus trapped, Esc closes, focus returns, the remembered email skips the form.
  - Copy buttons write the exact commands.
  - A direct request for a zip path 404s.
  - Screenshots of every page at 1440/768/390 into `.context/screenshots/`, compared against the boards in `design/`.
- **Lighthouse** (`next start`): performance and accessibility ≥ 95 on `/` and `/kits/context-labs`.
- **End to end on a Vercel preview:** download email arrives → the link downloads the right zip → the link fails after its `exp` is edited.
- **Toggle:** `NEXT_PUBLIC_WAITLIST` true/false locally renders the two home pages.
- After building, run "update my context". CONTEXT.md gains the new env vars, the kit bundle, the rate-limit IDs and the Loops gotcha under "Rules that have bitten before".
