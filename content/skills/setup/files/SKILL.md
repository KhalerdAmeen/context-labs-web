---
name: context-labs-setup
description: Builds and maintains a project's CONTEXT.md, the single file every future Claude session, design pass and build prompt reads from. Scans an existing codebase (or researches the category for a new idea), asks the user short pop-up questions built from what it found, and writes CONTEXT.md with every line tagged by its source. Use when the user says "set up context", "set up the project context", "write my brief", "update my context", "my app looks generic", starts a new project, or before a redesign in Claude Design.
allowed-tools:
  - Read
  - Grep
  - Glob
  - AskUserQuestion
---

# Context Labs: Setup

A project's knowledge is usually scattered: a PRD here, a design handoff
there, decisions buried in old plans and chats, rules that live only in the
founder's head. Claude starts every session knowing none of it, so its output
drifts toward the average. This skill gathers that knowledge into one short,
sourced file, `CONTEXT.md`, and wires it so every future session loads it.

The user never edits files. They answer questions. You do the reading,
the writing and the bookkeeping.

## References

Read each one when its step needs it, not all up front:

| File | Read before |
|---|---|
| [where-to-look.md](references/where-to-look.md) | Step 2 (scan) |
| [questions.md](references/questions.md) | Step 4 (ask) |
| [template.md](references/template.md) | Step 5 (write) |
| [mobile-rules.md](references/mobile-rules.md) | Step 5, only for iOS / Android apps |

## Step 1: Pick the mode

Check the working directory:

- `CONTEXT.md` exists → **Update mode** (go to the Update section).
- Code exists (`package.json`, `app.json`, `*.xcodeproj`, `pubspec.yaml`,
  `src/`, `app/`) → **Extract mode**.
- Neither → **Create mode** (go to the Create section).

If it's unclear (for example a folder of docs with no code), ask once.

## Extract mode

Show progress as one short line per step as you reach it, e.g.
`Step 2/7 · scanning the project`. Don't print a checkbox list.

Steps: 1 mode · 2 scan · 3 report · 4 ask · 5 write · 6 wire in · 7 report.

### Step 2: Scan (silent)

Follow [where-to-look.md](references/where-to-look.md). Read; don't
summarise to the user yet. Collect:

- **Stack:** framework, version, key libraries, backend, analytics, payments.
- **Surface:** screens/routes and their count, navigation structure.
- **Design facts:** colour values and how often each is used, fonts, radii,
  spacing, theme files, component library.
- **Existing context:** PRD, README, design handoffs, plan folders, docs,
  inspiration folders, CLAUDE.md / AGENTS.md, and anything you already know
  about this project from saved memory. Note which of these the current
  CLAUDE.md actually loads.
- **Taste references:** inspiration folders (count the images, open a
  sample of 6–10 to see what they share) and any reference apps named in
  docs. If none are named, Round 4 must ask for them.
- **Hard-won rules:** gotchas, workarounds and "never do X" notes from
  memory, CLAUDE.md, plans and code comments. These are among the most
  valuable lines in CONTEXT.md; keep every one that still holds.
- **Commands:** how to run, type-check, lint, build and ship (from
  package.json scripts, README, SETUP docs).
- **Tensions:** places where docs and code disagree, things that look
  unfinished, leftovers, duplicates. These are the most valuable findings:
  each becomes a question.

### Step 3: Report

One short message, in this shape:

```
Found: <stack in one line>, <N> screens, <backend>.
Existing context: <docs found> — <which ones CLAUDE.md loads today>.
Worth checking:
- <tension 1, with numbers and file paths>
- <tension 2>
- <tension 3>
Next: a few quick questions so I don't guess.
```

### Step 4: Ask

Read [questions.md](references/questions.md). Rules that matter most:

- Use the AskUserQuestion tool. At most 4 questions per call, 2–4 options
  each, options built from what you found (real hex values, real file
  names, real counts).
- Never ask what the code or docs already answer. Ask about tensions,
  intent and taste.
- 3 to 5 rounds total. Stop early when nothing important is unknown.
- If the question tool isn't available, ask the same questions as a short
  numbered list with lettered options, and wait.

### Step 5: Write CONTEXT.md

Follow [template.md](references/template.md) exactly. Non-negotiable:

- **Verify before writing.** Every file, function, symbol or setting you
  name must exist in the code now. Check each one (grep or read). Memory
  and old plans go stale; a claim that fails the check is dropped or
  corrected, and you say so in the final report.
- **Every fact carries a source tag** (pointer lines that only list where a
  document lives are exempt): `[code: path]`, `[doc: path]`,
  `[plan: file]`, `[memory]`, `[you]`, `[research]`, `[rule]`. No tag, no
  line. A `[memory]` line must also pass the verify step.
- **Keep what's already good.** If CLAUDE.md or AGENTS.md already holds
  useful content (commands, gotchas), carry it into CONTEXT.md with a
  `[doc: CLAUDE.md]` tag rather than losing it or duplicating it. Leave
  the original file's content in place.
- **Short.** CONTEXT.md loads into every session, so every line costs
  tokens forever. Target 150–300 lines. Link long documents instead of
  copying them ("Full PRD: Md/routn-PRD.md").
- **Decisions, not descriptions.** "Accent appears on primary action and
  stars only" beats "the app uses red".
- **Never** copy secrets, keys or `.env` values into CONTEXT.md.
- If CONTEXT.md somehow exists already, never overwrite it silently: show
  what would change and ask.

### Step 6: Wire it in (ask first)

Ask with the question tool: "Load CONTEXT.md automatically in every Claude
Code session here?" Options: "Yes, add it to CLAUDE.md" / "Not yet".
On yes, add one line `@CONTEXT.md` to `CLAUDE.md` (create CLAUDE.md if it
doesn't exist). Keep everything already in CLAUDE.md.

### Step 7: Final report

Three to six lines: where CONTEXT.md is, how many lines and from how many
sources, the open questions you left in it, and the natural next step
(for example "ready for a Claude Design pass" or "run: update my context
after your next big change").

## Create mode (no code yet)

Same checklist, but replace the scan with research:

1. Ask for the idea in one sentence if the user hasn't given it.
2. **Research:** use web search for the top 3–5 products in the category.
   If a Mobbin MCP is connected, use `Mobbin:search_screens` for their
   core screens. Find what they all share: layout, palette, type, tone.
   That shared look is **the category default**.
3. **Report** the category default in 3 lines.
4. **Ask** (questions.md, "Create mode" section): who exactly, the core
   10-second action, three words for the feel plus references from outside
   apps, which parts of the category default to refuse, and the stack.
5. **Write CONTEXT.md** with the same template. Build section says
   `pending — no code yet`. Tags are mostly `[you]` and `[research]`.
6. Tell the user where to keep it: in a Claude Project's knowledge until a
   repo exists, then in the repo root (where Step 6 wires it in).

## Update mode (CONTEXT.md exists)

1. Read CONTEXT.md and its `Last updated` date.
2. Find what changed since then: new or removed screens, new colours or
   fonts, new docs or plans, finished plans, dependency changes. Use git
   history when there is a repo.
   If the user points you at images (an inspiration folder, screenshots),
   open a sample of 6–10 and write one line on what they share (layout,
   colour, type, density). Counting files is not enough.
3. Report the changes in a short list.
4. Ask only about changes that affect decisions ("You added a green
   #46C18A in 3 files. Make it the success colour, or remove it?").
5. Edit CONTEXT.md in place: update the affected lines, append to the
   Decisions log with today's date, update `Last updated`. Never rewrite
   sections the user didn't touch.

## Hard rules

| Never | Instead |
|---|---|
| Invent a fact, number or decision | Ask, or leave it under Open questions |
| A line without a source tag | Tag it, or delete it |
| Paste the whole PRD or plan into CONTEXT.md | Summarise the decisions and link the file |
| Ask what the code already answers | Ask about tensions, intent and taste |
| Generic options ("Modern", "Clean") | Options built from real findings |
| Edit CLAUDE.md without asking | Step 6 question first |
| Overwrite CONTEXT.md silently | Show the change, ask, then edit |
| Secrets or `.env` values in CONTEXT.md | Note that a key exists, never its value |
